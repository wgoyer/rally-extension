var eventListeners = {
	saveTemplate : function(){
		document.getElementById("save-template").addEventListener("click", function(){
			chrome.tabs.executeScript(null, {code: 'document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML;'}, function(result){
				var formattedTags = $("#template-tags").val().split(",");
				for(var i=0;i<formattedTags.length;i++) {
					formattedTags[i] = formattedTags[i].trim();
				}
				getSettingsFromLocalStorage("rally-ext-templates", function(currentTemplates){
					currentTemplates.templates.push({"name": $("#template-name").val(), "tags": formattedTags, "template" : result[0]});
					saveValuesToLocalStorage("rally-ext-templates", currentTemplates);
					document.getElementById("template-append").innerHTML = result[0];	
				});
			});
		});
	},
	getTemplate : function(){
	document.getElementById("get-template").addEventListener("click", function(){
			$("#template-append").addClass("enabled");
			var nameTextBox = "<label>Name: </label><input type='text' id='template-name'></input><span class='subtext'>Name your template</span>";
			var nameTags = "<label>Tags: </label><input type='text' id='template-tags'></input><span class='subtext'>Add tags, use commas to separate</span>";
			chrome.tabs.executeScript(null, {code: 'document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML;'}, function(result){
				document.getElementById("template-append").innerHTML = result[0];
				document.getElementById("template-info").innerHTML = nameTextBox + nameTags;
			});
		});
	},
	// Look at replacing regex to properly escape all the characters in the localStorage template.
	restoreTemplate : function(){	
		document.getElementById("restore-template").addEventListener("click", function(){
			var myElement = "document.getElementsByTagName('iframe')[0].contentDocument.body.innerHTML = '"
			var template = $("#template-append").html(); 
			template = JSON.stringify(template).addSlashes();
			template = template.slice(1);
			template = template.slice(0,-1);
			template = template + "'";
			chrome.tabs.executeScript(null, {code: myElement+template});			
		});
	},
	saveBookMark : function(){
		document.getElementById("save-bookmark").addEventListener("click", function(){
			if(!localStorage["rally-ext-bookmarks"]) localStorage["rally-ext-bookmarks"] = "[]";
			getSettingsFromLocalStorage("rally-ext-bookmarks", function(currentBookMarks){
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
						currentBookMarks.push({"title":tab.title, "url":tab.url});
						saveValuesToLocalStorage("rally-ext-bookmarks", currentBookMarks);	
					}
				});	
			});
		});
	},
	restoreBookMark : function(){
		document.getElementById("restore-bookmarks").addEventListener("click", function(){
			getSettingsFromLocalStorage("rally-ext-bookmarks", function(savedRallyBookMarks){
				var urlArray = [];
				for(var i=0;i<savedRallyBookMarks.length;i++){
					urlArray.push(savedRallyBookMarks[i].url);
				}
				chrome.windows.create({url: urlArray});
			});
		});
	}
};