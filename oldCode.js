	//In start extensions in bg.js
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
	
	
	// tabs execute script under pullArtifactAndStoreToRecents bg.js: 
	var waitForDOMAndPullTitle = 'document.addEventListener("DOMContentLoaded", function(){document.title;});'

	chrome.tabs.executeScript(tab.id, {file : './injection/scrapeFromDetailPage.js'}, function(result){
		console.log(result);
	});
	
	
	//This is stupid.  Apparently onUpdate does not update the tab's title when the "complete" update is called, so we have to re-query the tab to get current title.
	
	setTimeout(function(){
		chrome.tabs.get(tab.id, function(tabData){
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
		});
	},5000);
	
	
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

//requestTheArtifactDetails
var startIndex = reqUrl.indexOf('ObjectID%20%3D%20'),
		endIndex = reqUrl.indexOf(')');
	var oid = reqUrl.substring(startIndex+17, endIndex),
	newUrl = "https://rally1.rallydev.com/slm/webservice/v2.x/HierarchicalRequirement/"+oid+"?fetch=FormattedID";


//createRegXs
var artifacts = ["userstory/", "defectsuite/", "defect/", "task/", "iteration/", "release/", "portfolioitem/", "testcase/", "milestone/"],