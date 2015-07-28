function Recents(settings){
	this.settings = settings;
	var me = this;
	this.loadMostRecentsAndAppend = function(elementId){
		var appendableElement,
			groups = [];
			
		elementId ? appendableElement = $(elementId) : appendableElement = $("#recently-visited");
		if(settings.recentlyVisited.length == 0){
			appendableElement.append("<p>Items will be displayed here after you start visiting the detail pages of items in your artifacts type list found on the options page of the extension.</p>");
		} else {
			if(me.settings.groupTogether){
				var currentType,
					countByGroup = {},
					groupAppendElement;
				for(var i=0;i<me.settings.recentlyVisited.length;i++){
					currentType = me.settings.recentlyVisited[i].artifactType;
					if(groups.indexOf(currentType) == -1) {
						groups.push(currentType);
						countByGroup[currentType] = 0;
						groupAppendElement = appendableElement.append("<div id='"+currentType+"'><p class='strong'>"+currentType+"</p></div>");
					}
					if(countByGroup[currentType] < me.settings.recentAmount){
						countByGroup[currentType]++
						me.buildHTML(me.settings.recentlyVisited[i], groupAppendElement);	
					}
				}
			} else {
				for(var i = 0;i<me.settings.recentAmount;i++){
					me.buildHTML(me.settings.recentlyVisited[i], appendableElement);
				}
			}
		}
	};
	this.buildHTML = function(item, appendableElement){
		var injectableHTML;
		injectableHTML = "<p class=truncate><a target='_blank' href='"+item.URL+"'>"+item.FormattedID+"</a>: "+item.Title+"</p>";
		appendableElement.append(injectableHTML);
	};
	this.updateSettings = function(){
		getSettingsFromLocalStorage("rally-ext-recents", function(recents){
			me.settings = recents;
		});
	};
};