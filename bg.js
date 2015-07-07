/* global chrome */
var settings = JSON.parse(localStorage["rally-ext"]);

var checkAutoStartAndRun = function(){
	if(JSON.parse(localStorage['rally-ext']).autoStartValue) return startExtension();
};
// var startExtension = function(){
// 	var changeUrl = "";
// 	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tabState){
// 		if(changeInfo.status === "loading" && changeInfo.url) changeUrl = changeInfo.url;
// 		if(changeInfo.status === "complete" && changeUrl !== ""){
// 			if(changeUrl.substring(8, settings.domain.length+8) === settings.domain){
// 				changeUrl = "";
// 				return checkURLforArtifactInfo(tabState);
// 			};
// 		}	
// 	});
// };
var startExtension = function(){
	chrome.webNavigation.onCompleted.addListener(function(navDetails){
		chrome.tabs.get(navDetails.tabId, function(tab){
			return checkURLforArtifactInfo(tab);
		});
	}, {
		url: [{hostContains: settings.domain}]
	});
};

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
var pullArtifactInfoAndStoreToRecents = function(tab){
	var recents = {},
		currentIndex = 0,
	currentItem = {"Title" : tabData.title, "URL" : tabData.url};
	if(localStorage['rally-ext-recents']){
		recents = JSON.parse(localStorage['rally-ext-recents']);
		currentIndex = recents.recentlyVisited.indexOf(currentItem);
		if(currentIndex !== -1){
			recents.recentlyVisisted.splice(currentIndex, 1)
		}
	} 
	return recents.recentlyVisited.unshift(currentItem);
	localStorage['rally-ext-recents'] = JSON.stringify(recents);
	
	// var waitForDOMAndPullTitle = 'document.addEventListener("DOMContentLoaded", function(){document.title;});'

	// chrome.tabs.executeScript(tab.id, {file : './injection/scrapeFromDetailPage.js'}, function(result){
	// 	console.log(result);
	// });
	
	
	//This is stupid.  Apparently onUpdate does not update the tab's title when the "complete" update is called, so we have to re-query the tab to get current title.
	
	// setTimeout(function(){
	// 	chrome.tabs.get(tab.id, function(tabData){
	// 		var recents = {},
	// 			currentIndex = 0,
	// 			currentItem = {"Title" : tabData.title, "URL" : tabData.url};
	// 		if(localStorage['rally-ext-recents']){
	// 			recents = JSON.parse(localStorage['rally-ext-recents']);
	// 			currentIndex = recents.recentlyVisited.indexOf(currentItem);
	// 			if(currentIndex !== -1){
	// 				recents.recentlyVisisted.splice(currentIndex, 1)
	// 			}
	// 		} 
	// 		return recents.recentlyVisited.unshift(currentItem);
	// 	});
	// },5000);
};



checkAutoStartAndRun();