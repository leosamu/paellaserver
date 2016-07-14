var Task = require(__dirname + '/../models/task');
var Catalog = require(__dirname + '/../models/catalog');
var Q = require('q');


function getCatalogPriorityForVideo(videoData) {
	var deferred = Q.defer();
	
	Catalog.findOne({_id:videoData.catalog}, function(err, elem){			
		var priority = 10;
		if ( (!err) && (elem) ){
			priority = elem.tasksPriority;
		}
		
		deferred.resolve(priority);
	});	
		
	return deferred.promise;
}


var Utils = {
	genLowRes:function(videoData) {
		return getCatalogPriorityForVideo(videoData)
		.then(function(priority){	
			return new Task({
				task:'encode',
				targetType:'video',
				error:false,
				targetId:videoData._id,
				priority:priority
			}).save();
		});
	},

	extractSlides:function(videoData) {
		return getCatalogPriorityForVideo(videoData)
		.then(function(priority){
			return new Task({
				task:'extractSlides',
				targetType:'video',
				error:false,
				targetId:videoData._id,
				priority:priority
			}).save();
		});
	},

	processTranslectures:function(videoData) {
		return getCatalogPriorityForVideo(videoData)
		.then(function(priority){
			return new Task({
				task:'translectures',
				targetType:'video',
				error:false,
				targetId:videoData._id,
				priority:priority
			}).save();
		});
	},

	notify:function(videoData) {
		return getCatalogPriorityForVideo(videoData)
		.then(function(priority){	
			return new Task({
				task:'notify',
				targetType:'video',
				error:false,
				targetId:videoData._id,
				priority:priority
			}).save();
		});
	},

	generateMD5:function(videoData) {
		return getCatalogPriorityForVideo(videoData)
		.then(function(priority){	
			return new Task({
				task:'md5',
				targetType:'video',
				error:false,
				targetId:videoData._id,
				priority:priority
			}).save();
		});
	},

	workflow:function(videoData,tasks) {
		return getCatalogPriorityForVideo(videoData)
		.then(function(priority){
			return new Task({
				task:'workflow',
				targetType:'video',
				error:false,
				targetId:videoData._id,
				priority:priority,
				parameters:JSON.stringify(tasks),
				description: "Processing video '" + videoData.title + "' from catalog '" + videoData.catalog + "'"
			}).save();			
		});	
	}
};

exports.Utils = Utils;

// Add all the video tasks to a video. Use it when a new video is added to the catalog
//	Input: req.data > Single video or array of videos
//	Output: none
exports.AddVideoTasks = function(req,res,next) {
	var tasks = [];

	function addTasks(video) {
		var taskList = [ { task:"calculateDuration" }, { task:"encode" }, { task:"extractSlides" }, { task:"translectures" }, { task:"md5" } ];
		if (video.unprocessed) {
			taskList.push({ task:"notify" });
		}
		tasks.push(Utils.workflow(video,taskList));
	}

	if (Array.isArray(req.data)) {
		req.data.forEach(function(video) {
			addTasks(video);
		});
	}
	else if (req.data && req.data._id) {
		addTasks(req.data);
	}

	Q.all(tasks)
		.then(function() {
			next();
		});
};
