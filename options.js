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

document.addEventListener('DOMContentLoaded', addEventListeners);