/* global chrome */
var settings = JSON.parse(localStorage["rally-ext"]),
	xmlRequest=new XMLHttpRequest(),
	artifactInfo = {
		map : {
			"userstory": "HierarchicalRequirement", 
			"defectsuite": "DefectSuite", 
			"defect":"Defect", 
			"task" : "Task", 
			"iteration":"Iteration", 
			"release":"Release", 
			"portfolioitem":"PortfolioItem", 
			"testcase": "TestCase", 
			"milestone":"Milestone"
		}
	};
var checkAutoStartAndRun = function(){
	if(JSON.parse(localStorage['rally-ext']).autoStartValue) return startExtension();
};

var startExtension = function(){
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
}
// var startExtension = function(){
// 	chrome.webRequest.onCompleted.addListener(function(req){
// 		makeStupidRequest(req.url, function(res){
// 			pullArtifactInfoAndStoreToRecents(JSON.parse(res).HierarchicalRequirement);
// 		});
// 	}, {
// 		"urls": ["https://rally1.rallydev.com/slm/webservice/v2.x/HierarchicalRequirement?*"],
// 		"types": ["xmlhttprequest"]
// 		// "tabId": "",
// 		// "windowId": "" 
// 	});
// };


	
	
// var makeStupidRequest = function(reqUrl, callback){
// 	var startIndex = reqUrl.indexOf('ObjectID%20%3D%20'),
// 		endIndex = reqUrl.indexOf(')');
// 	var oid = reqUrl.substring(startIndex+17, endIndex),
// 	newUrl = "https://rally1.rallydev.com/slm/webservice/v2.x/HierarchicalRequirement/"+oid+"?fetch=FormattedID";
// 	xmlRequest.open('GET',newUrl,true);
// 	xmlRequest.send();
	
// 	xmlRequest.onreadystatechange = function(){
// 		if(xmlRequest.readyState === 4){
// 			callback(xmlRequest.responseText);
// 		}
// 	}
// }

var requestTheArtifactDetails = function(url, callback){
	// var startIndex = reqUrl.indexOf('ObjectID%20%3D%20'),
	// 	endIndex = reqUrl.indexOf(')');
	// var oid = reqUrl.substring(startIndex+17, endIndex),
	// newUrl = "https://rally1.rallydev.com/slm/webservice/v2.x/HierarchicalRequirement/"+oid+"?fetch=FormattedID";
	var urlChunks = url.substring(8).split('/'),
		artifactType = urlChunks[urlChunks.length-2],
		artifactOid = urlChunks[urlChunks.length-1],
		newUrl = "";
		
		if(artifactType === "userstory") artifactType = "HierarchicalRequirement";
		newUrl = "https://"+settings.domain+"/slm/webservice/v2.x/"+artifactType+"/"+artifactOid;
	
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
				return requestTheArtifactDetails(tab.url, function(xhrResponse){
					pullArtifactInfoAndStoreToRecents(JSON.parse(xhrResponse));
				});
			} 
		}	
	});
};
var createRegXs = function(callback){
	// Will want to change the artifacts array to match what was selected in the settings.
	var artifacts = ["userstory/", "defectsuite/", "defect/", "task/", "iteration/", "release/", "portfolioitem/", "testcase/", "milestone/"],
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