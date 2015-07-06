/* global chrome */
var settings = JSON.parse(localStorage["rally-ext"]);
var startExtension = function(){
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tabState){
		if(changeInfo.url.substring(8, settings.domain.length) === settings.domain){
			checkURLforArtifactInfo(changeInfo.url);	
		};
	});
};
var checkURLforArtifactInfo = function(url){
	var artifacts = ["defect", "portfolioitem", "userstory", "task", "testcase", "defectsuite", "milestone", "iteration", "release"],
		uriRegex = new RegExp();
	for(var i=0;i<artifacts.length;i++){
		uriRegex = "//detail//"+artifacts[i]+"//";
		if(url === uriRegex) {
			console.log("Matched the URI: "+ url);
		} 
	}
};