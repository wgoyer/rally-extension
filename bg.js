/* global chrome */
// Notes, bugs and the etceteras:
// Need to ignore cases where users 404 but still match criteria.  If possible let's not make a request.
// 		http://stackoverflow.com/questions/5341452/fetch-dns-error-and-error-404-with-a-chrome-extension


var settings = JSON.parse(localStorage["rally-ext"]),
	xmlRequest=new XMLHttpRequest();
var checkAutoStartAndRun = function(){
	if(JSON.parse(localStorage['rally-ext']).autoStartValue) return startExtension();
};
var startExtension = function(){
	artifactInfo.getWatchArtifacts();
	if(!localStorage["rally-ext-recents"]) localStorage["rally-ext-recents"] = '{"recentlyVisited" : []}';
	var changeUrl = "";
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tabState){
		if(changeInfo.status === "loading" && changeInfo.url) changeUrl = changeInfo.url;
		if(changeInfo.status === "complete" && changeUrl !== ""){
			if(changeUrl.substring(8, settings.domain.length+8) === settings.domain){
				changeUrl = "";
				return checkURLforArtifactInfo(tabState);
			};
		}	
	});
};
var requestTheArtifactDetails = function(url, callback){
	var urlChunks = url.substring(8).split('/'),
		artifactType = urlChunks[urlChunks.length-2],
		artifactOid = urlChunks[urlChunks.length-1],
		newUrl = "https://"+settings.domain+"/slm/webservice/v2.x/"+artifactInfo[artifactType].objName+"/"+artifactOid;
	
	xmlRequest.open('GET',newUrl,true);
	xmlRequest.send();
	
	xmlRequest.onreadystatechange = function(){
		if(xmlRequest.readyState === 4){
			callback(artifactType, xmlRequest.responseText);
		}
	}
};
var checkURLforArtifactInfo = function(tab){
	createRegXs(function(regeXs){
		for(var i=0;i<regeXs.length;i++){
			if(regeXs[i].test(tab.url)) {
				return requestTheArtifactDetails(tab.url, function(artifactType, xhrResponse){
					var res = JSON.parse(xhrResponse),
						firstParam = artifactInfo[artifactType].objName;
					pullArtifactInfoAndStoreToRecents(res[firstParam], tab.url);
				});
			} 
		}	
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

checkAutoStartAndRun();