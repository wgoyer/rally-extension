/* global chrome */
String.prototype.addSlashes = function() 
{ 
   return this.replace(/'/g, "\\'");
} 
var bg = chrome.extension.getBackgroundPage();
var addEventListeners = function(){
	loadMostRecentsAndAppend();
	document.getElementById("get-template").addEventListener("click", function(){
		chrome.tabs.executeScript(null, {code: 'document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML;'}, function(result){
			localStorage["rally-ext-templates"] = result[0];
		});
	});
	// Look at changing replace regex to propery escape all the characters in the localStorage template.
	document.getElementById("restore-template").addEventListener("click", function(){
		var myElement = "document.getElementsByTagName('iframe')[0].contentDocument.body.innerHTML = '"
		var template = JSON.stringify(localStorage['rally-ext-templates']).addSlashes();
			template = template.slice(1);
			template = template.slice(0,-1);
			template = template + "'";
		chrome.tabs.executeScript(null, {code: myElement+template});
	});
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