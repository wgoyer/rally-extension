/// <reference path="typings/jquery/jquery.d.ts"/>
/* global chrome */
String.prototype.addSlashes = function() 
{ 
   return this.replace(/'/g, "\\'");
} 
var bg = chrome.extension.getBackgroundPage();
var addEventListeners = function(){
	getSettingsFromLocalStorage('rally-ext', function(settings){
		$("#accordion").accordion({
			heightStyle: "content",
			create: function(event, ui){
				$(this).accordion("option", "active", settings.activeAccordion || 0);
			},
			activate: function(event, ui){
				settings.activeAccordion = $(this).accordion("option", "active");
				saveValuesToLocalStorage('rally-ext', settings);
			}
		});
	});
	loadMostRecentsAndAppend();	
	document.getElementById("save-template").addEventListener("click", function(){
		chrome.tabs.executeScript(null, {code: 'document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML;'}, function(result){
			localStorage["rally-ext-templates"] = result[0];
			document.getElementById("template-append").innerHTML = result[0];
		});
	});
	document.getElementById("get-template").addEventListener("click", function(){
		var nameTextBox = "<label>Name: </label><input type='text' id='template-name'></input><span class='subtext'>Name your template</span>";
		var nameTags = "<label>Tags: </label><input type='text' id='template-tags'></input><span class='subtext'>Add tags, use commas to separate</span>";
		chrome.tabs.executeScript(null, {code: 'document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML;'}, function(result){
			document.getElementById("template-append").innerHTML = result[0];
			document.getElementById("template-info").innerHTML = nameTextBox + nameTags;
		});
	});
	// Look at replacing regex to properly escape all the characters in the localStorage template.
	document.getElementById("restore-template").addEventListener("click", function(){
		var myElement = "document.getElementsByTagName('iframe')[0].contentDocument.body.innerHTML = '"
		var template = JSON.stringify(localStorage['rally-ext-templates']).addSlashes();
			template = template.slice(1);
			template = template.slice(0,-1);
			template = template + "'";
		chrome.tabs.executeScript(null, {code: myElement+template});
	});
	document.getElementById("save-bookmark").addEventListener("click", function(){
		if(!localStorage["rally-ext-bookmarks"]) localStorage["rally-ext-bookmarks"] = "[]";
		getSettingsFromLocalStorage("rally-ext-bookmarks", function(currentBookMarks){
			var tab;
			chrome.windows.getCurrent({"populate": true}, function(window){
				for(var i=0;i<window.tabs.length;i++){
					if(window.tabs[i].active) {
						tab = window.tabs[i];
						break;
					};
				}
				var theIndex = tab.title.indexOf("| Rally");
				if(theIndex != "-1"){
					tab.title = tab.title.substring(0, theIndex-1);
					currentBookMarks.push({"title":tab.title, "url":tab.url});
					saveValuesToLocalStorage("rally-ext-bookmarks", currentBookMarks);
					// localStorage["rally-ext-bookmarks"] = JSON.stringify(currentBookMarks);	
				}
			});	
		});
		// var currentBookMarks = JSON.parse(localStorage["rally-ext-bookmarks"]),
	});
	document.getElementById("restore-bookmarks").addEventListener("click", function(){
		getSettingsFromLocalStorage("rally-ext-bookmarks", function(savedRallyBookMarks){
			var urlArray = [];
			for(var i=0;i<savedRallyBookMarks.length;i++){
				urlArray.push(savedRallyBookMarks[i].url);
			}
			chrome.windows.create({url: urlArray});
		});
	});
};
var saveActiveAccordion = function(settings){
	settings.activeAccordion = $("#accordion").accordion("option", "active");
	saveValuesToLocalStorage('rally-ext', settings);
};
var loadMostRecentsAndAppend = function(){
	getSettingsFromLocalStorage('rally-ext-recents', function(recents){
		document.getElementById("recently-visited").innerHTML = "<h3>Your recently visited Items</h3>";
		if(recents.recentlyVisited.length == 0){
			document.getElementById("recently-visited").innerHTML += "<p>Items will be displayed here after you start visiting the detail pages of items in your artifacts type list found on the options page of the extension.</p>";
		}
		for(var i = 0;i<recents.recentlyVisited.length;i++){
			buildHTMLForRecents(recents.recentlyVisited[i]);
		}
	});
};
var buildHTMLForRecents = function(item){
	var appendableElement = document.getElementById("recently-visited"),
		injectableHTML = "<p class=truncate><a target='_blank' href='"+item.URL+"'>"+item.FormattedID+"</a>: "+item.Title+"</p>";
	appendableElement.innerHTML += injectableHTML;
};
var getSettingsFromLocalStorage = function(settingType, callback){
	var settings = JSON.parse(localStorage[settingType]);
	callback(settings);	
};
var saveValuesToLocalStorage = function(settingType, values, callback){
	localStorage[settingType] = JSON.stringify(values);
	if (callback) return callback();
	return null;
};
document.addEventListener('DOMContentLoaded', addEventListeners);