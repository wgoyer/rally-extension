var inputFieldElements = {
	saveButton : document.getElementById("save-button"),
	domainValue : document.getElementById("domain"),
};

var addEventListeners = function(){
	restoreOptions();
	inputFieldElements.saveButton.addEventListener('click', saveSettings);
};
var saveSettings = function(){
	var domainValue = document.getElementById("domain"),
		tempSettings = {};
		if(domainValue.value == "") {
			tempSettings.domain = "rally1.rallydev.com";
		} else {
			tempSettings.domain = domainValue.value;
		}
	localStorage["rally-ext"] = JSON.stringify(tempSettings);
};
var restoreOptions = function(){
	var appSettings = {};
	if(localStorage['rally-ext']) { 
		appSettings = JSON.parse(localStorage['rally-ext']);
		inputFieldElements.domainValue.value = appSettings.domain;
	}
};

document.addEventListener('DOMContentLoaded', addEventListeners);