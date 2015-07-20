function Templates(settings){
	this.settings = settings;
	this.loadTemplate = function(templateName){
		for(var i = 0;i<settings.templates.length;i++){
			if(settings.templates[i].name === templateName){
				$("#template-append").addClass("enabled");
				return document.getElementById("template-append").innerHTML = settings.templates[i].template;
			}
		}
	},
	this.loadTemplateAndAppend = function(){
		if(this.settings.templates.length == 0){
			$(".template-header").html("A list of your templates will be displayed here once you've saved your first one.");
		} else {
			$("#search").html("<label for'autocomplete'>Search by Tag: </label><input id ='autocomplete'><hr>");
			$("#autocomplete").autocomplete({
				select: function(event, ui) {
					filterTemplatesOnTag(ui.item.value);
				},
				create: function(){
					loadAutoCompleteValues();
				}
			});
			for(var i=0;i<this.settings.templates.length;i++){
				buildHTMLForTemplates(this.settings.templates[i]);
			}	
		}
	}
	this.listeners = {
		loadTemplateOnLinkClick : function(){
			$("#template-append").on("click", "a", function(){
				loadTemplate($(this).text());
			});
		}	
	}
}