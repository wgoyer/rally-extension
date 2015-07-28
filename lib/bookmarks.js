function Bookmarks(settings){
	var me = this;
	this.settings = settings;
	this.loadBookMarksAndAppend = function(elementId){
		var appendableElement,
			groups = [];
			
		elementId ? appendableElement = $(elementId) : appendableElement = $("#bookmark-append");
		if(me.settings.length == 0){
			$(appendableElement).append("A list of your Rally saved bookmarks will be displayed here once you've saved a bookmark.");
		} else {
			for(var i=0;i<me.settings.length;i++){
				$(appendableElement).append("<p class='truncate'><a target='_blank' href='"+me.settings[i].url+"'>"+me.settings[i].title+"</a></p>");
			}
		}
	};
	this.updateSettings = function(){
		getSettingsFromLocalStorage("rally-ext-bookmarks", function(bookmarks){
			me.settings = bookmarks;	
		});
	};
	this.addListeners = function(){
		// When user clicks save bookmark, save current-tab URL to local storage.
		// todo: Add fav-icon for easy reference.
		$("#save-bookmark").on("click", function(){
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
					me.settings.push({"title": tab.title, "url": tab.url, "favicon": tab.favIconUrl});
					saveValuesToLocalStorage("rally-ext-bookmarks", me.settings);	
				} else {
					me.settings.push({"title": tab.title, "url": tab.url, "favicon": tab.favIconUrl});
				}
				$("#bookmark-append").empty();
				me.loadBookMarksAndAppend();
			});
		});
		// When user clicks on open all bookmarks button, this will create an array of just the urls
		// so that chrome can open them in a new window.
		$("#restore-bookmarks").on("click", function(){
			var urlArray = [];
			for(var i=0;i<me.settings.length;i++){
				urlArray.push(me.settings[i].url);
			}
			chrome.windows.create({url: urlArray});
		});
	}
};