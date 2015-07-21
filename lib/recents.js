function Recents(settings){
	this.settings = settings;
	var me = this;
	this.loadMostRecentsAndAppend = function(){
		if(settings.recentlyVisited.length == 0){
			document.getElementById("recently-visited").innerHTML += "<p>Items will be displayed here after you start visiting the detail pages of items in your artifacts type list found on the options page of the extension.</p>";
		} else {
			for(var i = 0;i<me.settings.recentlyVisited.length;i++){
				me.buildHTML(me.settings.recentlyVisited[i]);
			}	
		}				
	};
	this.buildHTML = function(item){
		var appendableElement = document.getElementById("recently-visited"),
		injectableHTML = "<p class=truncate><a target='_blank' href='"+item.URL+"'>"+item.FormattedID+"</a>: "+item.Title+"</p>";
		appendableElement.innerHTML += injectableHTML;
	};
	this.updateSettings = function(){
		getSettingsFromLocalStorage("rally-ext-recents", function(recents){
			me.settings = recents;
		});
	}	
};