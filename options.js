var inputFieldElements = {
	saveButton : document.getElementById("save-button"),
	domainValue : document.getElementById("domain"),
	autoStartValue : document.getElementById("auto-start")
};

var addEventListeners = function(){
	restoreOptions();
	inputFieldElements.saveButton.addEventListener('click', saveSettings);
};
var saveSettings = function(){
	var domainValue = document.getElementById("domain"),
		autoStartValue = document.getElementById("auto-start"),
		tempSettings = {};
	tempSettings.domain = domainValue.value || "rally1.rallydev.com";
	tempSettings.autoStartValue = autoStartValue.checked || false;
	localStorage["rally-ext"] = JSON.stringify(tempSettings);
};
var restoreOptions = function(){
	var appSettings = JSON.parse(localStorage['rally-ext']);
	inputFieldElements.domainValue.value = appSettings.domain;
	inputFieldElements.autoStartValue.checked = appSettings.autoStartValue || false;
};

document.addEventListener('DOMContentLoaded', addEventListeners);