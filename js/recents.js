function Recents(settings){
	this.settings = settings;
	var me = this;
	this.loadMostRecentsAndAppend = function(){
		var appendableElement = $("#recently-visited"),
			groups = [];
		// Seems like this can probably be cleaned up.	
		if(me.settings.recentlyVisited.length == 0){
			appendableElement.append("<p>Items will be displayed here after you start visiting the detail pages of items in your artifacts type list found on the options page of the extension.</p>");
		} else {
			// if the user has grouping set up
			if(me.settings.groupTogether){
				var currentType,
					countByGroup = {},
					groupAppendElement;
					// iterate through all recents
				for(var i=0;i<me.settings.recentlyVisited.length;i++){
					// If the item has been marked as tagged, append to the pinned div.
					if(me.settings.recentlyVisited[i].pinned) {
						$(".strong.pinned.hidden").removeClass("hidden");
						me.buildHTML(me.settings.recentlyVisited[i], $("#pinned-recents"), true);
					} else {
						// otherwise find the group it belongs to, create it if it doesn't exist and append the item to it
						// but only append up to the amount specified in the settings.
						currentType = me.settings.recentlyVisited[i].artifactType;
						if(groups.indexOf(currentType) == -1) {
							groups.push(currentType);
							countByGroup[currentType] = 0;
							appendableElement.append("<div id='"+currentType+"'><p class='strong'>"+currentType+"</p></div>");
							groupAppendElement = $("[id='"+currentType+"']");
						}
						if(countByGroup[currentType] < me.settings.recentAmount){
							groupAppendElement = $("[id='"+currentType+"']");
							countByGroup[currentType]++
							me.buildHTML(me.settings.recentlyVisited[i], groupAppendElement);	
						}
					}
				}
			} else {
				for(var i = 0;i<me.settings.recentAmount && i < me.settings.recentlyVisited.length;i++){
					if(me.settings.recentlyVisited[i].pinned) {
						me.buildHTML(me.settings.recentlyVisited[i], $("#pinned-recents"), true);
						$(".divider").removeClass('hidden');
					} else {
						me.buildHTML(me.settings.recentlyVisited[i], appendableElement);
					}
				}
			}
		}
	};
	this.buildHTML = function(item, appendableElement, isPinned){
		var injectableHTML = ""; 
		if(isPinned){
			$(".strong.pinned.hidden").removeClass("hidden");
			injectableHTML = "<p class=truncate><span artifactType='"+item.artifactType+"' id='pin-"+me.settings.recentlyVisited.indexOf(item)+"' class='pin-icon mark-pinned'><i class='fa fa-thumb-tack'></i></span><a target='_blank' href='"+item.URL+"'>"+item.FormattedID+"</a>: "+item.Title+"</p>";
		} else {
			injectableHTML = "<p class=truncate><span artifactType='"+item.artifactType+"' id='pin-"+me.settings.recentlyVisited.indexOf(item)+"' class='pin-icon'><i class='fa fa-thumb-tack'></i></span><a target='_blank' href='"+item.URL+"'>"+item.FormattedID+"</a>: "+item.Title+"</p>" 
		}	
		appendableElement.append(injectableHTML);
	};
	this.addListeners = function(){
		// This mess will move pinned icons to a pinned div and remove the div it's in if it was
		// the only item in there.  Vice versa, it will move pinned items back to the artifact
		// it was under.  This needs to be modified to create a group div if it doesn't already exist.
		$(".pin-icon").on("click", function(){
			if ($(this).hasClass("mark-pinned")) {
				$(this).removeClass("mark-pinned");
				me.settings.recentlyVisited[$(this).attr("id").substring(4)].pinned = false;
				if(me.settings.groupTogether){
					var artifactType = $(this).attr('artifactType'),
						artifactDiv;
					artifactDiv = $("[id='"+artifactType+"']");
					if(artifactDiv.length==0){
						$("#recently-visited").append("<div id='"+artifactType+"'><p class='strong'>"+artifactType+"</p></div>");
						artifactDiv = $("[id='"+artifactType+"']");
					}
					artifactDiv.removeClass("hidden");
					$(this).parent().appendTo(artifactDiv);
				} else {
					$(this).parent().appendTo($("#recently-visited"));	
				}
				if($("#pinned-recents").children().length<2) {
					$(".strong.pinned").addClass("hidden");
					$(".divider").addClass("hidden");
				}
				me.writeSettings();
			} else {
				$(this).addClass("mark-pinned");
				me.settings.recentlyVisited[$(this).attr("id").substring(4)].pinned = true;
				$(this).parent().appendTo($("#pinned-recents"));
				if(!me.settings.groupTogether) $(".divider").removeClass("hidden");
				$(".strong.pinned.hidden").removeClass("hidden");
				if($("[id='"+$(this).attr('artifactType')+"']").children().length<2) $("[id='"+$(this).attr('artifactType')+"']").addClass("hidden");
				me.writeSettings();
			}
		});
	};
	this.updateSettings = function(){
		me.settings = JSON.parse(localStorage["rally-ext-recents"]);
	};
	this.writeSettings = function(){
		localStorage["rally-ext-recents"] = JSON.stringify(me.settings);
	};
};