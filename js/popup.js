var templates = new Templates(JSON.parse(localStorage["rally-ext-templates"]));
var bookmarks = new Bookmarks(JSON.parse(localStorage["rally-ext-bookmarks"]));
var recents = new Recents(JSON.parse(localStorage["rally-ext-recents"]));

var startPopup = function(){
	createAccordion(JSON.parse(localStorage["rally-ext"]));
	recents.loadMostRecentsAndAppend();
	templates.loadTemplatesAndAppend();
	templates.addListeners();
	bookmarks.loadBookMarksAndAppend();
	bookmarks.addListeners();
	recents.addListeners();
};
var createAccordion = function(settings){
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
document.addEventListener('DOMContentLoaded', startPopup);