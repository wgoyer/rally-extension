/* global chrome */
var bg = chrome.extension.getBackgroundPage();
var addEventListeners = function(){
	loadMostRecentsAndAppend();
};
var loadMostRecentsAndAppend = function(){
	var recents = JSON.parse(localStorage["rally-ext-recents"]);
	if(recents.recentlyVisited.length > 0){
		document.getElementById("recently-visited").innerHTML = "<h3>Your recently visited Items</h3>";
	}
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