var addEventListeners = function(){
	var saveButton = document.getElementById("save-button");
	saveButton.addEventListener('click', saveSettings);
};
var saveSettings = function(){
	var domainValue = document.getElementById("domain"),
		tempSettings = {};
	tempSettings.domain = domainValue.value || "rally1.rallydev.com"; 
	localStorage["rally-ext"] = JSON.stringify(tempSettings);
};

document.addEventListener('DOMContentLoaded', addEventListeners);