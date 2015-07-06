/* global chrome */
var bg = chrome.extension.getBackgroundPage();
var addEventListeners = function(){
	var startExtensionButton = document.getElementById("start-extension-button");
	startExtensionButton.addEventListener('click', bg.startExtension);
};
document.addEventListener('DOMContentLoaded', addEventListeners);