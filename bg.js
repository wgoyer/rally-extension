/* global chrome */
// Notes, bugs and the etceteras:

// Need to ignore cases where users 404 but still match criteria.  If possible let's not make a request.
// 		Review errors from WSAPI and don't push to local storage if they exist as well.  May need to 
//		handle unauthorized access as well
// 		http://stackoverflow.com/questions/5341452/fetch-dns-error-and-error-404-with-a-chrome-extension

// If possible, let's try and prevent any requests if a user already has the artifact in recents.  Instead let's just move it to the top of the pile.

// Change fetch to formattedID

// Grabbing the data for iframes: document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML = "What?!"

var settings,
	xmlRequest=new XMLHttpRequest();
	
var initSettings = function(callback) {
	if(!localStorage["rally-ext-recents"]) localStorage["rally-ext-recents"] = '{"recentlyVisited" : []}';
	if(!localStorage["rally-ext"]) localStorage["rally-ext"] = '{"domain" : "rally1.rallydev.com", "selectedArtifacts" : []}';
	artifactInfo.getWatchArtifacts();
	settings = JSON.parse(localStorage["rally-ext"]);
	callback();
};
var startExtension = function(){
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tabState){
		if(tabState.url.substring(8, settings.domain.length+8) === settings.domain){
			return checkURLforArtifactInfo(tabState);
		};
	});
};
var sendRequest = function(url, callback){
	xmlRequest.open('GET', url, true);
	xmlRequest.send();

	xmlRequest.onreadystatechange = function(){
		if(xmlRequest.readyState === 4){
			callback(xmlRequest.responseText);
		}
	}
}
var requestTheArtifactDetails = function(url, callback){
	var urlChunks = url.substring(8).split('/'),
		newUrl = "",
		artifactType = urlChunks[urlChunks.length-2],
		artifactOid = urlChunks[urlChunks.length-1];
		for (var i=0; i < settings.selectedArtifacts.length; i++){
			if (artifactType === settings.selectedArtifacts[i]){
				newUrl = "https://"+settings.domain+"/slm/webservice/v2.x/"+artifactInfo[artifactType].objName+"/"+artifactOid+"?fetch=FormattedID, Name";
				break;
			}
		}
		if(newUrl === "") return;
		sendRequest(newUrl, function(res){
			callback(artifactType, res);
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
			return requestTheArtifactDetails(tab.url, function(artifactType, xhrResponse){
				var res = JSON.parse(xhrResponse),
					firstParam = artifactInfo[artifactType].objName;
				pullArtifactInfoAndStoreToRecents(res[firstParam], tab.url);
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
var pullArtifactInfoAndStoreToRecents = function(artifact, url){
	var recentStorage = JSON.parse(localStorage['rally-ext-recents']),
		recents = {recentlyVisited : recentStorage.recentlyVisited || []},
		currentItem = {"FormattedID" : artifact.FormattedID, "Title" : artifact._refObjectName, "URL" : url};
		
	if(recentStorage.recentlyVisited.length>0){
		for(var i=0;i<recentStorage.recentlyVisited.length;i++){
			if(recentStorage.recentlyVisited[i].FormattedID === currentItem.FormattedID){
				recents.recentlyVisited.splice(i, 1);	
			}
		}
	} 
	recents.recentlyVisited.unshift(currentItem);
	return localStorage['rally-ext-recents'] = JSON.stringify(recents);	
};

var updateSettings = function(){
	
};

initSettings(startExtension);