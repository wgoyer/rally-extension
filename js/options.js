// fa-refresh for iteration icon
// fa-rocket for release
// fa-bug for defects
// fa-folder for portfolio
// fa-book for user story
// fa-flask for test case
// 

/// <reference path="typings/jquery/jquery.d.ts"/>
var recents = new Recents(JSON.parse(localStorage["rally-ext-recents"])),
	bookmarks = new Bookmarks(JSON.parse(localStorage["rally-ext-bookmarks"])),
	recentsToDelete = [];

// var inputFieldElements = {
// 	saveButton : document.getElementById("save-button"),
// 	domainValue : document.getElementById("domain"),
// };

var addEventListeners = function(){
	loadRecentsToPage();
	loadBookmarksToPage();
	restoreOptions();
	$(".trash-icon").on("click", function(e){
		if ($(this).hasClass("mark-for-delete")) {
			$(this).removeClass("mark-for-delete");
			recentsToDelete.splice(recentsToDelete.indexOf($(this).attr("id")), 1);
		} else { 
			$(this).addClass("mark-for-delete");
			recentsToDelete.push($(this).attr("id"));
		}
	});
	$("#save-button").on("click", saveSettings);
};
var saveSettings = function(){
	var domainValue = $("#domain").val(),
		checkedValues = document.querySelectorAll("input[type=checkbox]"),
		tempSettings = {"selectedArtifacts" : []};
	if(domainValue == "") {
		tempSettings.domain = "rally1.rallydev.com";
	} else {
		tempSettings.domain = domainValue;
	}
	for(var i = 0;i<checkedValues.length;i++){
		if(checkedValues[i].checked == true){
			tempSettings.selectedArtifacts.push(checkedValues[i].value);
		}
	}
	localStorage["rally-ext"] = JSON.stringify(tempSettings);
};
var restoreOptions = function(){
	var appSettings = {},
		domainValue = $("#domain");
	appSettings = JSON.parse(localStorage['rally-ext']);
	domainValue.val(appSettings.domain);
	for(var i=0;i<appSettings.selectedArtifacts.length;i++){
		document.querySelector("input[value="+appSettings.selectedArtifacts[i]+"]").checked = true;
	}
};

var loadRecentsToPage = function(){
	$("#recents-group").prop("checked", recents.settings.groupTogether);
	$("#recents-count").prop("value", recents.settings.recentAmount);
	recents.loadMostRecentsAndAppend("#recents-append");
	var allRecents = $("#recents-append .truncate");
	if(allRecents.length>0){
		$("#clear-all-recents").prop("disabled", false);
		$("#clear-all-recents").on("click", function(){
			recents.settings.recentlyVisited = [];
			$("#span-clear-all-recents").html("<p>All recents are marked for removal.  Press the Save button to apply</p>")
			$(".trash-icon").addClass("mark-for-delete");
		});
		var pinIconHtml,
			trashCanHtml;
			
		for(var i=0;i<allRecents.length;i++){
			pinIconHtml = "<span class='pin-icon'><i id='recents-"+i+"' class='fa fa-thumb-tack'></span></i>" 
			trashCanHtml = "<span id='delete-"+i+"' class='trash-icon'><i class='fa fa-trash'></span></i>" 
			$($(allRecents)[i]).prepend(pinIconHtml + trashCanHtml);
		}	
	} else {
		$("#clear-all-recents").prop("disabled", true);
	}
};

var loadBookmarksToPage = function(){
	bookmarks.loadBookMarksAndAppend("#bookmarks-append");
};


document.addEventListener('DOMContentLoaded', addEventListeners);