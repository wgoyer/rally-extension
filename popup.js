/* global chrome */
var bg = chrome.extension.getBackgroundPage();
var addEventListeners = function(){
	// var startExtensionButton = document.getElementById("start-extension-button");
	// startExtensionButton.addEventListener('click', bg.startExtension);
	loadMostRecentsAndAppend();
};
var loadMostRecentsAndAppend = function(){
	var recents = JSON.parse(localStorage["rally-ext-recents"]);
	for(var i = 0;i<recents.recentlyVisited.length;i++){
		buildHTMLForRecents(recents.recentlyVisited[i]);
	}
};
var buildHTMLForRecents = function(item){
	var appendableElement = document.getElementById("recently-visited"),
		injectableHTML = "<hr><p><a target='_blank' href='"+item.URL+"'>"+item.FormattedID+"</a>: "+item.Title+"</p>";
	appendableElement.innerHTML += injectableHTML; 
};

document.addEventListener('DOMContentLoaded', addEventListeners);