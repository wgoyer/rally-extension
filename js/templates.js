function Templates(settings){
	String.prototype.addSlashes = function(){ 
   		return this.replace(/'/g, "\\'");
	}
	var me = this;
	this.settings = settings;
	// Load a template into the pop-up for applying.
	this.loadTemplate = function(templateName){
		for(var i = 0;i<settings.templates.length;i++){
			if(me.settings.templates[i].name === templateName){
				$("#template-append").addClass("enabled");
				return $("#template-append").html(me.settings.templates[i].template);
			}
		}
	}
	// Goes through all templates and appends the HTML for the template href and tags on the row. 
	this.buildHTMLForTemplates = function(item){
		var itemId = item.name.replace(/\s+/g, '-');
		var formattedTags = "";
		for(var i=0;i<item.tags.length;i++) {
			if(i<item.tags.length-1){
				formattedTags += item.tags[i] + ", "	
			} else {
				formattedTags += item.tags[i];
			}
		} 
		$("#template-append").append("<p class = 'truncate'><label class='strong'>Name: </label><a href = '#' id ='"+itemId+"'>"+item.name+"</a><label class='strong'> Tags: </label>"+formattedTags+"</p>");
	}
	// Puts the HTML on the page and initializes the autocomplete tag box.
	this.loadTemplatesAndAppend = function(){
		if(me.settings.templates.length == 0){
			$(".template-header").html("A list of your templates will be displayed here once you've saved your first one.");
		} else {
			$("#search").html("<label for'autocomplete'>Search by Tag: </label><input id ='autocomplete'><hr>");
			$("#autocomplete").autocomplete({
				select: function(event, ui) {
					me.filterTemplatesOnTag(ui.item.value);
				},
				create: function(){
					me.loadAutoCompleteValues();
				}
			});
			for(var i=0;i<me.settings.templates.length;i++){
				me.buildHTMLForTemplates(me.settings.templates[i]);
			}	
		}
	}
	// Gets settings from local storage.
	this.updateSettings = function(){
		me.settings = JSON.parse(localStorage["rally-ext-templates"]);
	}
	this.filterTemplatesOnTag = function(tag){
		$("#template-append").html("<button>Clear Filter</button>");
		for(var i=0;i<me.settings.templates.length;i++){
			if(me.settings.templates[i].tags.indexOf(tag) > -1) {
				me.buildHTMLForTemplates(me.settings.templates[i]);
			}
		}
	}
	// Pull the tag values and load them into the autocomplete tag box.
	this.loadAutoCompleteValues = function(){
		var allTagsFromAllTemplates = [],
			filteredTags = [];
		
		for(var i=0;i<me.settings.templates.length;i++){
			if(me.settings.templates[i].tags.length > 0){
				for(var y=0;y<settings.templates[i].tags.length;y++){
					if(me.settings.templates[i].tags[y] != ""){
						allTagsFromAllTemplates.push(me.settings.templates[i].tags[y].trim());	
					}
				}
			}	
		}
		filteredTags = allTagsFromAllTemplates.filter(function(item, i, ar){return ar.indexOf(item) === i;});
		$("#autocomplete").autocomplete("option", "source", filteredTags);
	}
	this.addListeners = function(){
		// Loads the template into the pop-up from the link.
		$("#template-append").on("click", "a", function(){
			me.loadTemplate($(this).text());
			$("#restore-template").removeClass("hidden");
			$("#cancel").removeClass("hidden");
			$("#save-template").addClass("hidden");
			$("#get-template").addClass("hidden");
		});
		// Remove the filter and clear filter button.
		$("#template-append").on("click", "button", function(){
			$("#template-append").empty();
			me.loadTemplatesAndAppend();
			$(this).remove();
		});
		// Save template into local storage when a user clicks on the save template button.
		$("#save-template").on("click", function(){
			chrome.tabs.executeScript(null, {code: 'document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML;'}, function(result){
				var formattedTags = $("#template-tags").val().split(",");
				for(var i=0;i<formattedTags.length;i++) {
					formattedTags[i] = formattedTags[i].trim();
				}
				me.settings.templates.push({"name": $("#template-name").val(), "tags": formattedTags, "template" : result[0]});
				saveValuesToLocalStorage("rally-ext-templates", me.settings);
				$("#save-template").removeClass("enabled");
				$("#template-append").empty();
				$("#template-info").remove();
				me.loadTemplatesAndAppend();
			});
		});
		// Load template into the popup when the user clicks get template button.
		$("#get-template").on("click", function(){
			$("#template-append").addClass("enabled");
			var nameTextBox = "<label>Name: </label><input type='text' id='template-name'></input><span class='subtext'>Name your template</span>";
			var nameTags = "<label>Tags: </label><input type='text' id='template-tags'></input><span class='subtext'>Add tags, use commas to separate</span>";
			chrome.tabs.executeScript(null, {code: 'document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML;'}, function(result){
				$("#template-append").html(result[0]);
				$("#template-info").html(nameTextBox + nameTags);
				$("#template-name").focus();
			});
			$("#save-template").removeClass("hidden");
			$("#restore-template").addClass("hidden");
			$("#cancel").removeClass("hidden");
		});
		// Applies the loaded template into the description field of the artifact the user is on.
		$("#restore-template").on("click", function(){
			var myElement = "document.getElementsByTagName('iframe')[0].contentDocument.body.innerHTML = '"
			var template = $("#template-append").html(); 
			template = JSON.stringify(template).addSlashes();
			template = template.slice(1);
			template = template.slice(0,-1);
			template = template + "'";
			chrome.tabs.executeScript(null, {code: myElement+template});
		});
		$("#cancel").on("click", function(){
			$("#template-append").removeClass("enabled");
			$("#get-template").removeClass("hidden");
			$("#restore-template").addClass("hidden");
			$("#save-template").addClass("hidden");
			$(this).addClass("hidden");
			$("#template-append").empty();
			$("#template-info").remove();
			me.loadTemplatesAndAppend();
		});
	}
}