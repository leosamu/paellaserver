
var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

function loadPolimedia(streamsArray, videos, preview) {
	var videoStreamData = {
		mp4: []
	};

	videos.forEach(function(video) {
		videoStreamData.mp4.push({
			src:video.src,
			mimetype:video.mimetype,
			res:{
				w:video.width,
				h:video.height
			}
		});
	});

	streamsArray.push({
		sources:videoStreamData,
		preview:preview
	});
}

exports.routes = {
	getVideoData: { extension:'json', get:[
		VideoController.LoadVideo,
		VideoController.LoadUrlFromRepository,
		function(req,res) {
			var metadata = {
				"duration":req.data.duration,
				"title":req.data.title
			};
			var streams = [];
			var frameList = [];

			if (req.data.source.type=="polimedia") {
				loadPolimedia(streams, req.data.source.videos, req.data.thumbnail);
			}

			res.json({
				"metadata":metadata,
				"streams":streams,
				"frameList":req.data.slides
			});
		}]}
};