var artifactInfo = {
	// "watchedArtifacts" : ["userstory", "defectsuite", "defect", "task", "iteration", "release", "portfolioitem", "testcase", "milestone"],
	watchedArtifacts : [],	
	userstory : {
		"name" : "userstory",
		"objName" : "HierarchicalRequirement",
		"regEx" : new RegExp("userstory/"),
	}, 
	defectsuite : {
		"name" : "defectsuite",
		"objName" : "DefectSuite",
		"regEx" : new RegExp("defectsuite/"),
	},
	defect : {
		"name" : "defect",
		"objName" : "Defect",
		"regEx" :  new RegExp("defect/")
	},
	task : {
		"name" : "task",
		"objName" : "Task",
		"regEx" : new RegExp("task/") 
	},
	iteration : {
		"name" : "iteration",
		"objName" : "Iteration",
		"regEx" : new RegExp("iteration/")
	},
	release : {
		"name" : "release",
		"objName" : "Release", 
		"regEx" : new RegExp("release/")
	},
	portfolioitem : {
		"name" : "portfolioitem",
		"objName" : "PortfolioItem", 
		"regEx" : new RegExp("portfolioitem/")
	},
	testcase : {
		"name" : "testcase",
		"objName" : "TestCase", 
		"regEx" : new RegExp("testcase/")
	},
	milestone : {
		"name" : "milestone",
		"objName" : "Milestone",
		"regEx" : new RegExp("milestone/")
	},
	getWatchArtifacts : function(){
		var localStorageSettings = JSON.parse(localStorage['rally-ext']).watchedArtifacts;
		if(localStorageSettings == [] || typeof(localStorageSettings) === "undefined") {
			this.watchedArtifacts = ["userstory", "defectsuite", "defect"];
		} else {
			this.watchedArtifacts = localStorageSettings.watchedArtifacts;	
		}
	}
}