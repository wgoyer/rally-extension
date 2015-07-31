// fa-refresh for iteration icon
// fa-rocket for release
// fa-bug for defects
// fa-folder for portfolio
// fa-book for user story
// fa-flask for test case
// 

/// <reference path="../typings/jquery/jquery.d.ts"/>
var recents = new Recents(JSON.parse(localStorage["rally-ext-recents"])),
	bookmarks = new Bookmarks(JSON.parse(localStorage["rally-ext-bookmarks"])),
	recentsToDelete = [],
	recentsToPin = [];

var addEventListeners = function(){
	recents.updateSettings();
	loadRecentsToPage();
	loadBookmarksToPage();
	restoreOptions();
	$(".button").button();
	recents.addListeners();
	$(".trash-icon").on("click", function(){
		if ($(this).hasClass("mark-for-delete")) {
			$(this).removeClass("mark-for-delete");
			recentsToDelete.splice(recentsToDelete.indexOf($(this).attr("id")), 1);
		} else { 
			$(this).addClass("mark-for-delete");
			recentsToDelete.push($(this).attr("id"));
		}
	});
	// $(".pin-icon").on("click", function(){
	// 	if ($(this).hasClass("mark-pinned")) {
	// 		$(this).removeClass("mark-pinned");
	// 		recentsToPin.splice(recentsToPin.indexOf($(this).attr("id")), 1);
	// 	} else {
	// 		$(this).addClass("mark-pinned");
	// 		recentsToPin.push($(this).attr("id"));
	// 	}
	// });
	$(".save-button").on("click", saveSettings);
};
var saveSettings = function(){
	var domainValue = $("#domain").val(),
		checkedValues = $(".settings-container input[type=checkbox]"),
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
	recents.settings.groupTogether = $("#recents-group").is(":checked");
	recents.settings.recentAmount = $("#recents-count").val();
	recents.writeSettings();
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
	recents.loadMostRecentsAndAppend();
	var allRecents = $("#all-recents .truncate");
	if(allRecents.length>0){
		$("#clear-all-recents").prop("disabled", false);
		$("#clear-all-recents").on("click", function(){
			recents.settings.recentlyVisited = [];
			$("#span-clear-all-recents").html("<p>All recents are marked for removal.  Press the Save button to apply</p>")
			$(".trash-icon").addClass("mark-for-delete");
		});
		var trashCanHtml;
		for(var i=0;i<allRecents.length;i++){
			if(allRecents) 
			trashCanHtml = "<span id='delete-"+i+"' class='trash-icon'><i class='fa fa-trash'></i></span>" 
			$($(allRecents)[i]).prepend(trashCanHtml);
		}	
	} else {
		$("#clear-all-recents").prop("disabled", true);
	}
};

var loadBookmarksToPage = function(){
	bookmarks.loadBookMarksAndAppend("#bookmarks-append");
};


document.addEventListener('DOMContentLoaded', addEventListeners);