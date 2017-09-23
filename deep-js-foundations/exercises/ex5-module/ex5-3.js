var Helpers = {
	maxVisibleWorkDescriptionLength: 20,
	minWorkDescriptionLength: 5,
	maxWorkTime: 600,

	validateWorkEntry(description,minutes) {
		if (description.length < Helpers.minWorkDescriptionLength) return false;
		if (
			/^\s*$/.test(minutes) ||
			Number.isNaN(Number(minutes)) ||
			minutes < 0 ||
			minutes > Helpers.maxWorkTime
		) {
			return false;
		}

		return true;
	},
	formatWorkDescription(description) {
		if (description.length > Helpers.maxVisibleWorkDescriptionLength) {
			description = `${description.substr(0,Helpers.maxVisibleWorkDescriptionLength)}...`;
		}
		return description;
	},
	formatTime(time) {
		var hours = Math.floor(time / 60);
		var minutes = time % 60;
		if (hours == 0 && minutes == 0) return "";
		if (minutes < 10) minutes = `0${minutes}`;
		return `${hours}:${minutes}`;
	}
};

// *****************************************************
// DRIVER CODE

var UI = setupUI();
UI.init();

var App = setupApp(UI);

// hard coding some initial data
App.addProject("client features");
App.addProject("overhead");
App.addProject("backlog");

// *****************************************************

function setupUI() {
	const projectTemplate = "<div class='project-entry'><h3 class='project-description' rel='js-project-description'></h3><ul class='work-entries' rel='js-work-entries'></ul><span class='work-time' rel='js-work-time'></span></div>";
	const workEntryTemplate = "<li class='work-entry'><span class='work-time' rel='js-work-time'></span><span class='work-description' rel='js-work-description'></span></li>";

	var $workEntryForm;
	var $workEntrySelectProject;
	var $workEntryDescription;
	var $workEntryTime;
	var $workEntrySubmit;
	var $totalTime;
	var $projectList;

	var projectElements = {};
	var workElements = {};

	var publicAPI = {
		init: initUI,
		addProjectToList: addProjectToList,
		addProjectSelection: addProjectSelection,
		addWorkEntryToList: addWorkEntryToList,
		updateProjectTotalTime: updateProjectTotalTime,
		updateWorkLogTotalTime: updateWorkLogTotalTime
	}

	return publicAPI;

	function initUI() {
		$workEntryForm = $("[rel*=js-work-entry-form");
		$workEntrySelectProject = $workEntryForm.find("[rel*=js-select-project]");
		$workEntryDescription = $workEntryForm.find("[rel*=js-work-description]");
		$workEntryTime = $workEntryForm.find("[rel*=js-work-time]");
		$workEntrySubmit = $workEntryForm.find("[rel*=js-submit-work-entry]");
		$totalTime = $("[rel*=js-total-work-time]");
		$projectList = $("[rel*=js-project-list]");

		$workEntrySubmit.on("click",submitNewWorkEntry);
	}

	function addProjectToList(project) {
		var $project = $(projectTemplate);
		$project.attr("data-project-id",project.getId());
		$project.find("[rel*=js-project-description]").text(project.getDescription());
		$projectList.append($project);

		projectElements[project.getId()] = $project;
	}

	function addProjectSelection(project) {
		var $option = $("<option></option>");
		$option.attr("value",project.getId());
		$option.text(project.getDescription());
		$workEntrySelectProject.append($option);
	}

	function addWorkEntryToList(project, workEntryData) {
		var $projectEntry = projectElements[project.getId()];
		var $projectWorkEntries = $projectEntry.find("[rel*=js-work-entries]");

		// create a new DOM element for the work entry
		var $workEntry = $(workEntryTemplate);
		$workEntry.attr("data-work-entry-id",workEntryData.id);
		$workEntry.find("[rel*=js-work-time]").text(Helpers.formatTime(workEntryData.time));
		setupWorkDescription(workEntryData,$workEntry.find("[rel*=js-work-description]"));

		workElements[workEntryData.id] = $workEntry;

		// multiple work entries now?
		var workEntryCount = project.getWorkEntryCount();
		if (workEntryCount > 1) {
			{ let adjacentWorkEntryId, insertBefore;
				[ adjacentWorkEntryId, insertBefore ] = project.getWorkEntryLocation(workEntryData.id);

				if (insertBefore) {
					workElements[adjacentWorkEntryId].before($workEntry);
				} else {
					workElements[adjacentWorkEntryId].after($workEntry);
				}
			}
		}
		// otherwise, just the first entry
		else {
			$projectEntry.addClass("visible");
			$projectWorkEntries.append($workEntry);
		}
	}

	function updateProjectTotalTime(project) {
		var $projectEntry = projectElements[project.getId()];
		$projectEntry.find("> [rel*=js-work-time]").text(Helpers.formatTime(project.getTime())).show();
	}

	function updateWorkLogTotalTime(totalTime) {
		if (totalTime > 0) {
			$totalTime.text(Helpers.formatTime(totalTime)).show();
		}
		else {
			$totalTime.text("").hide();
		}
	}

	function submitNewWorkEntry() {
		var projectId = $workEntrySelectProject.val();
		var description = $workEntryDescription.val();
		var minutes = $workEntryTime.val();

		if (!Helpers.validateWorkEntry(description,minutes)) {
			alert("Oops, bad entry. Try again.");
			$workEntryDescription[0].focus();
			return;
		}

		$workEntryDescription.val("");
		$workEntryTime.val("");
		App.addWorkToProject(Number(projectId),description,Number(minutes));
		$workEntryDescription[0].focus();
	}

	function setupWorkDescription(workEntryData,$workDescription) {
		$workDescription.text(Helpers.formatWorkDescription(workEntryData.description));

		if (workEntryData.description.length > Helpers.maxVisibleWorkDescriptionLength) {
		$workDescription
			.addClass("shortened")
			.on("click",function onClick(){
				$workDescription
					.removeClass("shortened")
					.off("click",onClick)
					.text(workEntryData.description);
			});
		}
	}
}

function setupApp(UI){
	var projects = [];
	var totalTime = 0;

	var publicAPI = {
		addProject: addProject,
		addWorkToProject: addWorkToProject,
	};

	return publicAPI;

	// **************************

	function addProject(description) {
		var project = new Project(description);

		projects.push(project);

		UI.addProjectToList(project);
		UI.addProjectSelection(project);
	}

	function findProjectEntry(projectId) {
		return projects.find(function findProject(project) {
			return project.getId() === projectId;
		});
	}

	function addWorkToProject(projectId,description,minutes) {
		totalTime += minutes;

		var project = findProjectEntry(projectId);
		var workEntryData = { id: project.getWorkEntryCount() + 1, description: description, time: minutes };

		project.addWork(workEntryData);

		UI.addWorkEntryToList(project, workEntryData);
		UI.updateProjectTotalTime(project);
		UI.updateWorkLogTotalTime(totalTime);
	}
}

function Project(description) {
	var projectId = Math.round(Math.random()*1E4);
	var projectDescription = description;

	var workEntries = [];

	var publicAPI = {
		getId: getId,
		getDescription: getDescription,
		getTime: getTime,
		addWork: addWork,
		getWorkEntryCount: getWorkEntryCount,
		getWorkEntryLocation: getWorkEntryLocation
	}

	return publicAPI;

	function getId() {
		return projectId;
	}

	function getDescription() {
		return projectDescription;
	}

	function getTime() {
		return workEntries.reduce(function allTimes(sum, entry) {
			return sum + entry.time;
		}, 0);
	}

	function addWork(workEntryData) {
		workEntries.push(workEntryData);

		if (getWorkEntryCount().length > 1) {
			sortWorkEntries();
		}
	}

	function sortWorkEntries() {
		workEntries = workEntries.slice().sort(function sortTimeDescending(a,b){
			return b.time - a.time;
		});
	}

	function getWorkEntryCount() {
		return workEntries.length;
	}

	function getWorkEntryLocation(workEntryId) {
		entry = workEntries.find(function getEntry(entry) {
			return entry.id == workEntryId;
		});

		if (entry.id < (getWorkEntryCount() - 1)) {
			return [ entry.id + 1, /*insert before*/true ];
		} else {
			return [ entry.id - 1, /*insert before*/false ];
		}
	}
}
