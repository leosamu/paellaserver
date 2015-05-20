
var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

function loadPolimedia(streamsArray, videos, slaveVideos, preview, slavePreview) {
	var masterStreamData = {
		mp4: []
	};

	var slaveStreamData = {
		mp4: []
	};

	function addStream(streamData,data) {
		streamData.mp4.push({
			src: data.src,
			mimetype: data.mimetype,
			res:{
				w: data.width,
				h: data.height
			}
		});
	}

	videos.forEach(function(video) {
		addStream(masterStreamData,video);
	});

	streamsArray.push({
		sources:masterStreamData,
		preview:preview
	});

	if (slaveVideos) {
		slaveVideos.forEach(function(video) {
			addStream(slaveStreamData, video);
		});
		streamsArray.push({
			sources:slaveStreamData,
			preview:slavePreview
		})
	}
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

			if (req.data.source.type=="polimedia") {
				loadPolimedia(streams, req.data.source.videos, req.data.source.slaveVideos, req.data.thumbnail);
			}

			res.json({
				"metadata":metadata,
				"streams":streams,
				"frameList":req.data.slides
			});
		}]}
};