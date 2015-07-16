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
	loadTemplatesAndAppend();
	loadBookMarksAndAppend();
	$("#template-append").on("click", "a", function(){
		loadTemplate($(this).text());
	});
	$("#template-append").on("click", "button", function(){
		$("#template-append").html("");
		loadTemplatesAndAppend();
		$(this).remove();
	});
	document.getElementById("save-template").addEventListener("click", function(){
		chrome.tabs.executeScript(null, {code: 'document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML;'}, function(result){
			var formattedTags = $("#template-tags").val().split(",");
			for(var i=0;i<formattedTags.length;i++) {
				formattedTags[i] = formattedTags[i].trim();
			}
			getSettingsFromLocalStorage("rally-ext-templates", function(currentTemplates){
				currentTemplates.templates.push({"name": $("#template-name").val(), "tags": formattedTags, "template" : result[0]});
				saveValuesToLocalStorage("rally-ext-templates", currentTemplates);
				document.getElementById("template-append").innerHTML = result[0];	
			});
		});
	});
	document.getElementById("get-template").addEventListener("click", function(){
		$("#template-append").addClass("enabled");
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
		var template = $("#template-append").html(); 
		template = JSON.stringify(template).addSlashes();
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
				}
			});	
		});
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
var loadAutoCompleteValues = function(){
	getSettingsFromLocalStorage("rally-ext-templates", function(templateSettings){
		var allTagsFromAllTemplates = [],
			filteredTags = [];
		for(var i=0;i<templateSettings.templates.length;i++){
			if(templateSettings.templates[i].tags.length > 0){
				for(var y=0;y<templateSettings.templates[i].tags.length;y++){
					if(templateSettings.templates[i].tags[y] != ""){
						allTagsFromAllTemplates.push(templateSettings.templates[i].tags[y].trim());	
					}
				}
			}	
		}
		filteredTags = allTagsFromAllTemplates.filter(function(item, i, ar){return ar.indexOf(item) === i;});
		$("#autocomplete").autocomplete("option", "source", filteredTags);			
	});
};

var loadTemplate = function(templateName){
	getSettingsFromLocalStorage("rally-ext-templates", function(currentTemplates){
		for(var i = 0;i<currentTemplates.templates.length;i++){
			if(currentTemplates.templates[i].name === templateName){
				$("#template-append").addClass("enabled");
				return document.getElementById("template-append").innerHTML = currentTemplates.templates[i].template;
			}
		}
	});
};
var saveActiveAccordion = function(settings){
	settings.activeAccordion = $("#accordion").accordion("option", "active");
	saveValuesToLocalStorage('rally-ext', settings);
};
var filterTemplatesOnTag = function(tag){
	getSettingsFromLocalStorage("rally-ext-templates", function(currentTemplates){
		$("#template-append").html("<button>Clear Filter</button>");
		for(var i=0;i<currentTemplates.templates.length;i++){
			if(currentTemplates.templates[i].tags.indexOf(tag) > -1) {
				buildHTMLForTemplates(currentTemplates.templates[i]);
			}
		}
	});
};
var loadMostRecentsAndAppend = function(){
	getSettingsFromLocalStorage('rally-ext-recents', function(recents){
		if(recents.recentlyVisited.length == 0){
			document.getElementById("recently-visited").innerHTML += "<p>Items will be displayed here after you start visiting the detail pages of items in your artifacts type list found on the options page of the extension.</p>";
		} else {
			for(var i = 0;i<recents.recentlyVisited.length;i++){
				buildHTMLForRecents(recents.recentlyVisited[i]);
			}	
		}
	});
};
var loadTemplatesAndAppend = function(){
	getSettingsFromLocalStorage('rally-ext-templates', function(currentTemplates){
		if(currentTemplates.templates.length == 0){
			$(".template-header").html("A list of your templates will be displayed here once you've saved your first one.");
		} else {
			$("#search").html("<label for'autocomplete'>Search by Tag: </label><input id ='autocomplete'><hr>");
			$("#autocomplete").autocomplete({
				select: function(event, ui) {
					filterTemplatesOnTag(ui.item.value);
				},
				create: function(){
					loadAutoCompleteValues();
				}
			});
			for(var i=0;i<currentTemplates.templates.length;i++){
				buildHTMLForTemplates(currentTemplates.templates[i]);
			}	
		}
	});
};
var loadBookMarksAndAppend = function(){
	getSettingsFromLocalStorage('rally-ext-bookmarks', function(bookmarks){
		if(bookmarks.length == 0){
			$("#bookmark-append").append("A list of your Rally saved bookmarks will be displayed here once you've saved a bookmark.");
		} else {
			for(var i=0;i<bookmarks.length;i++){
				$("#bookmark-append").append("<p class='truncate'><a target='_blank' href='"+bookmarks[i].url+"'>"+bookmarks[i].title+"</a></p>");
			}
		}
	});
};
var buildHTMLForRecents = function(item){
	var appendableElement = document.getElementById("recently-visited"),
		injectableHTML = "<p class=truncate><a target='_blank' href='"+item.URL+"'>"+item.FormattedID+"</a>: "+item.Title+"</p>";
	appendableElement.innerHTML += injectableHTML;
};
var buildHTMLForTemplates = function(item){
	var itemId = item.name.replace(/\s+/g, '-');
	var formattedTags = "";
	for(var i=0;i<item.tags.length;i++) {
		if(i<item.tags.length-1){
			formattedTags += item.tags[i] + ", "	
		} else {
			formattedTags += item.tags[i];
		}
	} 
	$("#template-append").append("<p class = 'truncate'><label class='strong'>Name: </label><a href = '#' id ='"+itemId+"'>"+item.name+"</a><label class='strong'> Tags: </label>"+formattedTags+"</p>");
}
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