var artifactInfo = {
	// "watchedArtifacts" : ["userstory", "defectsuite", "defect", "task", "iteration", "release", "portfolioitem", "testcase", "milestone"],
	watchedArtifacts : [],	
	userstory : {
		"name" : "userstory",
		"objName" : "HierarchicalRequirement",
		"regEx" : new RegExp("userstory/"),
		"fetch" : "FormattedID,Name"
	}, 
	defectsuite : {
		"name" : "defectsuite",
		"objName" : "DefectSuite",
		"regEx" : new RegExp("defectsuite/"),
		"fetch" : "FormattedID,Name"
	},
	defect : {
		"name" : "defect",
		"objName" : "Defect",
		"regEx" :  new RegExp("defect/"),
		"fetch" : "FormattedID,Name"
	},
	task : {
		"name" : "task",
		"objName" : "Task",
		"regEx" : new RegExp("task/"),
		"fetch" : "FormattedID,Name"
	},
	iteration : {
		"name" : "iteration",
		"objName" : "Iteration",
		"regEx" : new RegExp("iteration/"),
		"fetch" : "Name,StartDate,EndDate"
	},
	release : {
		"name" : "release",
		"objName" : "Release", 
		"regEx" : new RegExp("release/"),
		"fetch" : "Name,ReleaseStartDate,ReleaseDate"
	},
	portfolioitem : {
		"name" : "portfolioitem",
		"objName" : "PortfolioItem", 
		"regEx" : new RegExp("\/detail\/portfolioitem\/"),
		"fetch" : "FormattedID,Name"
	},
	testcase : {
		"name" : "testcase",
		"objName" : "TestCase", 
		"regEx" : new RegExp("testcase/"),
		"fetch" : "FormattedID,Name"
	},
	milestone : {
		"name" : "milestone",
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