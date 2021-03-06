/* global chrome */
// Notes, bugs and the etceteras:

// Need to ignore cases where users 404 but still match criteria.  If possible let's not make a request.
// 		Review errors from WSAPI and don't push to local storage if they exist as well.  May need to 
//		handle unauthorized access as well
// 		http://stackoverflow.com/questions/5341452/fetch-dns-error-and-error-404-with-a-chrome-extension

// If possible, let's try and prevent any requests if a user already has the artifact in recents.  Instead let's just move it to the top of the pile.

// Wire up options to have feedback and update the entire extension realtime.
// Make templates searchable by tag or name.
// Group bookmarks and allow users to open all tabs in a group.
// Add checkboxes to recents to allow users to keep them on top.


var settings,
	recents; 

var initSettings = function(callback) {
	if(!localStorage["rally-ext"]) localStorage["rally-ext"] = '{"domain" : "rally1.rallydev.com", "selectedArtifacts" : []}';
	if(!localStorage["rally-ext-recents"]) localStorage["rally-ext-recents"] = '{"recentlyVisited" : [], "groupTogether" : false, "recentAmount" : 15}';
	if(!localStorage["rally-ext-templates"]) localStorage["rally-ext-templates"] = '{"active" : "", "templates" : []}';
	recents = new Recents(JSON.parse(localStorage["rally-ext-recents"]));
	artifactInfo.getWatchArtifacts();
	settings = JSON.parse(localStorage["rally-ext"]);
	callback();
};
var startExtension = function(){
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tabState){
		if(tabState.url.substring(8, settings.domain.length+8) === settings.domain && changeInfo.url){
			return checkURLforArtifactInfo(tabState);
		};
	});
};
var sendRequest = function(url, callback){
	var xmlRequest=new XMLHttpRequest();
	xmlRequest.open('GET', url, true);
	xmlRequest.send();

	xmlRequest.onreadystatechange = function(){
		if(xmlRequest.readyState === 4){
			callback(xmlRequest.responseText);
		}
	}
};
var requestTheArtifactDetails = function(url, callback){
	// This should only be called if artifact in the URL matches the watchedList
	var urlChunks = url.substring(8).split('/'),
		newUrl = "",
		artifactType,
		artifactName,
		artifactOid;

		if(urlChunks[4] === "portfolioitem") {
			artifactType = urlChunks[4];
			artifactOid = urlChunks[6];
			newUrl = "https://"+settings.domain+"/slm/webservice/v2.x/portfolioitem/"+urlChunks[5]+"/"+artifactOid+"?fetch="+artifactInfo.portfolioitem.fetch;
			artifactName = artifactInfo[artifactType].name;
		} else {
			artifactType = urlChunks[4];
			artifactOid = urlChunks[5];
			newUrl = "https://"+settings.domain+"/slm/webservice/v2.x/"+artifactInfo[artifactType].objName+"/"+artifactOid+"?fetch="+artifactInfo[artifactType].fetch;
			artifactName = artifactInfo[artifactType].name;
		}				
		return sendRequest(newUrl, function(res){
			callback(artifactType, artifactName, res);
		});
};
var checkURLforArtifactInfo = function(tab){
	var matchFound = false;
	createRegXs(function(regeXs){
		for(var i=0;i<regeXs.length;i++){
			if(regeXs[i].test(tab.url)) {
				matchFound = true;
				break;
			}
		}
		if(matchFound){
			return requestTheArtifactDetails(tab.url, function(artifactType, artifactName, xhrResponse){
				var res = JSON.parse(xhrResponse),
					firstParam = res[Object.keys(res)[0]];
				pullArtifactInfoAndStoreToRecents(firstParam, artifactName, tab.url);
			});
		} else {
			return;
		};
	});
};
var createRegXs = function(callback){
	var allMyRegXsLiveInTexas = [],
		artifactsFromSettings = artifactInfo.watchedArtifacts;
	for(var i=0;i<artifactsFromSettings.length;i++){
		allMyRegXsLiveInTexas.push(artifactInfo[artifactsFromSettings[i]].regEx);
	};
	return callback(allMyRegXsLiveInTexas);
};
var pullArtifactInfoAndStoreToRecents = function(artifact, artifactName, url){
	// var recentStorage = JSON.parse(localStorage['rally-ext-recents']),
		recents.updateSettings();
		var settings = recents.settings,
		currentItem = {};
	if(artifact.FormattedID) {
		currentItem = {"FormattedID" : artifact.FormattedID, "Title" : artifact._refObjectName, "URL" : url, artifactType : artifactName};	
	} 
	if(artifact.StartDate){
		currentItem = {"FormattedID" : "Iteration", "Title" : artifact.Name, "URL" : url, artifactType : artifactName};	
	}
	if(artifact.ReleaseStartDate){
		currentItem = {"FormattedID" : "Release", "Title" : artifact.Name, "URL" : url, artifactType : artifactName};
	}		
	if(settings.recentlyVisited.length>0){
		for(var i=0;i<settings.recentlyVisited.length;i++){
			if(settings.recentlyVisited[i].FormattedID === currentItem.FormattedID){
				settings.recentlyVisited.splice(i, 1);	
			}
		}
	} 
	settings.recentlyVisited.unshift(currentItem);
	recents.writeSettings();
};

initSettings(startExtension);