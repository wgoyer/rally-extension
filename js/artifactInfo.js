var artifactInfo = {
	watchedArtifacts : [],	
	userstory : {
		"name" : "User Story",
		"objName" : "HierarchicalRequirement",
		"regEx" : new RegExp("userstory/"),
		"fetch" : "FormattedID,Name"
	}, 
	defectsuite : {
		"name" : "Defect Suite",
		"objName" : "DefectSuite",
		"regEx" : new RegExp("defectsuite/"),
		"fetch" : "FormattedID,Name"
	},
	defect : {
		"name" : "Defect",
		"objName" : "Defect",
		"regEx" :  new RegExp("defect/"),
		"fetch" : "FormattedID,Name"
	},
	task : {
		"name" : "Task",
		"objName" : "Task",
		"regEx" : new RegExp("task/"),
		"fetch" : "FormattedID,Name"
	},
	iteration : {
		"name" : "Iteration",
		"objName" : "Iteration",
		"regEx" : new RegExp("iteration/"),
		"fetch" : "Name,StartDate,EndDate"
	},
	release : {
		"name" : "Release",
		"objName" : "Release", 
		"regEx" : new RegExp("release/"),
		"fetch" : "Name,ReleaseStartDate,ReleaseDate"
	},
	portfolioitem : {
		"name" : "Portfolio Item",
		"objName" : "PortfolioItem", 
		"regEx" : new RegExp("\/detail\/portfolioitem\/"),
		"fetch" : "FormattedID,Name"
	},
	testcase : {
		"name" : "Test Case",
		"objName" : "TestCase", 
		"regEx" : new RegExp("testcase/"),
		"fetch" : "FormattedID,Name"
	},
	milestone : {
		"name" : "Milestone",
		"objName" : "Milestone",
		"regEx" : new RegExp("milestone/"),
		"fetch" : "FormattedID,Name"
	},
	getWatchArtifacts : function(){
		var localStorageSettings = JSON.parse(localStorage['rally-ext']).selectedArtifacts;
		if(localStorageSettings.length === 0 || typeof(localStorageSettings) === "undefined") {
			this.watchedArtifacts = ["userstory", "defectsuite", "defect"];
		} else {
			this.watchedArtifacts = localStorageSettings;	
		}
	}
}