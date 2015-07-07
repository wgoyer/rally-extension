/* global chrome */
var settings = JSON.parse(localStorage["rally-ext"]);

var checkAutoStartAndRun = function(){
	if(JSON.parse(localStorage['rally-ext']).autoStartValue) return startExtension();
};
var xmlRequest=new XMLHttpRequest();
var startExtension = function(){
	chrome.webRequest.onCompleted.addListener(function(req){
		makeStupidRequest(req.url, function(res){
			pullArtifactInfoAndStoreToRecents(JSON.parse(res).HierarchicalRequirement);
		});
	}, {
		"urls": ["https://rally1.rallydev.com/slm/webservice/v2.x/HierarchicalRequirement?*"],
		"types": ["xmlhttprequest"]
		// "tabId": "",
		// "windowId": "" 
	});
};


	
	
var makeStupidRequest = function(reqUrl, callback){
	var startIndex = reqUrl.indexOf('ObjectID%20%3D%20'),
		endIndex = reqUrl.indexOf(')');
	var oid = reqUrl.substring(startIndex+17, endIndex),
	newUrl = "https://rally1.rallydev.com/slm/webservice/v2.x/HierarchicalRequirement/"+oid+"?fetch=FormattedID";
	xmlRequest.open('GET',newUrl,true);
	xmlRequest.send();
	
	xmlRequest.onreadystatechange = function(){
		if(xmlRequest.readyState === 4){
			callback(xmlRequest.responseText);
		}
	}
}
var checkURLforArtifactInfo = function(tab){
	createRegXs(function(regeXs){
		for(var i=0;i<regeXs.length;i++){
			if(regeXs[i].test(tab.url)) {
				return pullArtifactInfoAndStoreToRecents(tab);
			} 
		}	
	});
};
var createRegXs = function(callback){
	// Will want to change the artifacts array to match what was selected in the settings.
	var artifacts = ["userstory", "defect", "task", "iteration", "release", "portfolioitem", "testcase", "defectsuite", "milestone"],
		allMyRegXsLiveInTexas = [];
	for(var i=0;i<artifacts.length;i++){
		allMyRegXsLiveInTexas.push(new RegExp(artifacts[i]));
	};
	return callback(allMyRegXsLiveInTexas);
};
var pullArtifactInfoAndStoreToRecents = function(artifact){
	var recents = {
		recentlyVisited : []
	},
		currentIndex = 0,
		currentItem = {"FormattedID" : artifact.formattedID, "Title" : artifact._refObjectName, "URL" : artifact._ref};
	if(localStorage['rally-ext-recents'] && localStorage['rally-ext-recents'] !== "[]"){
		recents = JSON.parse(localStorage['rally-ext-recents']);
		currentIndex = recents.recentlyVisited.indexOf(currentItem);
		if(currentIndex !== -1){
			recents.recentlyVisited.splice(currentIndex, 1);
		}
	} 
	recents.recentlyVisited.unshift(currentItem);
	return localStorage['rally-ext-recents'] = JSON.stringify(recents);	
};

checkAutoStartAndRun();