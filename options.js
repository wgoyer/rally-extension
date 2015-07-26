var recents = new Recents(JSON.parse(localStorage["rally-ext-recents"])),
	recentsToDelete = [];


var inputFieldElements = {
	saveButton : document.getElementById("save-button"),
	domainValue : document.getElementById("domain"),
};

var addEventListeners = function(){
	loadRecentsToPage();
	restoreOptions();
	$(".trash-icon").on("click", function(e){
		e.preventDefault();
		if ($(this).parent().hasClass("mark-for-delete")) {
			$(this).parent().removeClass("mark-for-delete");
			recentsToDelete.splice(recentsToDelete.indexOf($(this).attr("id")), 1);
		}
		else { 
			$(this).addClass("mark-for-delete");
			$(this).parent().addClass("mark-for-delete");
			recentsToDelete.push($(this).attr("id"));
		}
	});
	inputFieldElements.saveButton.addEventListener('click', saveSettings);
};
var saveSettings = function(){
	var domainValue = document.getElementById("domain"),
		checkedValues = document.querySelectorAll("input[type=checkbox]"),
		tempSettings = {"selectedArtifacts" : []};
		if(domainValue.value == "") {
			tempSettings.domain = "rally1.rallydev.com";
		} else {
			tempSettings.domain = domainValue.value;
		}
		for(var i = 0;i<checkedValues.length;i++){
			if(checkedValues[i].checked == true){
				tempSettings.selectedArtifacts.push(checkedValues[i].value);
			}
		}
	localStorage["rally-ext"] = JSON.stringify(tempSettings);
};
var restoreOptions = function(){
	var appSettings = {};
	if(localStorage['rally-ext']) { 
		appSettings = JSON.parse(localStorage['rally-ext']);
		inputFieldElements.domainValue.value = appSettings.domain;
		for(var i=0;i<appSettings.selectedArtifacts.length;i++){
			document.querySelector("input[value="+appSettings.selectedArtifacts[i]+"]").checked = true;
		}
	}
};

var loadRecentsToPage = function(){
	recents.loadMostRecentsAndAppend("#recents-append");
	var allRecents = $(".truncate"),
		theHtmlz;
		
	for(var i=0;i<allRecents.length;i++){
		theHtmlz = "<input id='recents-"+i+"' type='checkbox'> <a href='#' class='trash-icon' id='delete-"+i+"'><img class='icon' src='trash.png'></a>";
		$($(allRecents)[i]).prepend(theHtmlz);
	}
};


document.addEventListener('DOMContentLoaded', addEventListeners);