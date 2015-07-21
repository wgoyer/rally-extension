function Bookmarks(settings){
	this.settings = settings;
	this.loadBookMarksAndAppend = function(){
		if(this.settings.length == 0){
			$("#bookmark-append").append("A list of your Rally saved bookmarks will be displayed here once you've saved a bookmark.");
		} else {
			for(var i=0;i<this.settings.length;i++){
				$("#bookmark-append").append("<p class='truncate'><a target='_blank' href='"+this.settings[i].url+"'>"+this.settings[i].title+"</a></p>");
			}
		}
	};
	this.updateSettings = function(){
		getSettingsFromLocalStorage("rally-ext-bookmarks", function(bookmarks){
			this.settings = bookmarks;	
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
					this.settings.push({"title":tab.title, "url":tab.url});
					saveValuesToLocalStorage("rally-ext-bookmarks", this.settings);	
				} else {
					this.settings.push({"title": tab.title, "url": tab.url});
				}
			});
		});
		// When user clicks on open all bookmarks button, this will create an array of just the urls
		// so that chrome can open them in a new window.
		$("#restore-bookmarks").on("click", function(){
			var urlArray = [];
			for(var i=0;i<this.settings.length;i++){
				urlArray.push(this.settings[i].url);
			}
			chrome.windows.create({url: urlArray});
		});
	}
};