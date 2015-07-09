/* global chrome */
var bg = chrome.extension.getBackgroundPage();
var addEventListeners = function(){
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
		injectableHTML = "<hr><p class=truncate><a target='_blank' href='"+item.URL+"'>"+item.FormattedID+"</a>: "+item.Title+"</p>";
	appendableElement.innerHTML += injectableHTML;
};

document.addEventListener('DOMContentLoaded', addEventListeners);