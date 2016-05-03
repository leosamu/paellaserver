var Task = require(__dirname + '/../models/task');
var Q = require('q');

var Utils = {
	genLowRes:function(videoData) {
		return new Task({
			task:'encode',
			targetType:'video',
			error:false,
			targetId:videoData._id,
			priority:10
		}).save();
	},

	extractSlides:function(videoData) {
		return new Task({
			task:'extractSlides',
			targetType:'video',
			error:false,
			targetId:videoData._id,
			priority:10
		}).save();
	},

	processTranslectures:function(videoData) {
		return new Task({
			task:'translectures',
			targetType:'video',
			error:false,
			targetId:videoData._id,
			priority:10
		}).save();
	},

	notify:function(videoData) {
		return new Task({
			task:'notify',
			targetType:'video',
			error:false,
			targetId:videoData._id,
			priority:10
		}).save();
	},

	generateMD5:function(videoData) {
		return new Task({
			task:'md5',
			targetType:'video',
			error:false,
			targetId:videoData._id,
			priority:10
		}).save();
	},

	workflow:function(videoData,tasks) {
		return new Task({
			task:'workflow',
			targetType:'video',
			error:false,
			targetId:videoData._id,
			priority:10,
			parameters:JSON.stringify(tasks)
		}).save();
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
