var Task = require(__dirname + '/../models/task');
var Q = require('q');

var Utils = {
	genLowRes:function(videoData) {
		return new Task({
			task:'encode',
			targetType:'video',
			targetId:videoData._id
		}).save();
	},

	extractSlides:function(videoData) {
		return new Task({
			task:'extractSlides',
			targetType:'video',
			targetId:videoData._id
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
		tasks.push(Utils.genLowRes(video));
		tasks.push(Utils.extractSlides(video));
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
