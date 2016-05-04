
var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

function loadPolimedia(streamsArray, videos, slaveVideos, preview, slavePreview) {
	var masterStreamData = {};
	var slaveStreamData = {};

	function addStream(streamData,data) {
		var file = data.src  || data.href;
		var fileExt = file.split('.').pop().toLowerCase();
		if (fileExt=="mp4") {
			streamData.mp4 = streamData.mp4 || [];
			streamData.mp4.push({
				src: file,
				mimetype: data.mimetype || "video/mp4",
				res:{
					w: data.width || 1280,
					h: data.height || 720
				}
			});
		}
		else if (fileExt=='mpd') {
			streamData.mpd = streamData.mpd || [];
			streamData.mpd.push({
				src:file,
				mimetype: data.mimetype || 'video/mp4'
			});
		}
	}

	videos.forEach(function(video) {
		addStream(masterStreamData,video);
	});

	streamsArray.push({
		sources:masterStreamData,
		preview:preview
	});

	if (slaveVideos && slaveVideos.length) {
		slaveVideos.forEach(function(video) {
			addStream(slaveStreamData, video);
		});
		streamsArray.push({
			sources:slaveStreamData,
			preview:slavePreview
		});
	}
}

function loadLiveStream(streamsArray, videos, slaveVideos, preview, slavePreview) {
	var masterStreamData = {
		rtmp: []
	};

	var slaveStreamData = {
		rtmp: []
	};

	function addStream(streamData,data) {
		streamData.rtmp.push({
			src: {
				server:data.server,
				stream:data.stream
			},
			mimetype: data.mimetype || "video/mp4",
			res:{
				w: data.width || 1280,
				h: data.height || 720
			},
			"isLiveStream": true
		});
	}

	videos.forEach(function(video) {
		addStream(masterStreamData,video);
	});

	streamsArray.push({
		sources:masterStreamData,
		preview:preview
	});

	if (slaveVideos && slaveVideos.length) {
		slaveVideos.forEach(function(video) {
			addStream(slaveStreamData, video);
		});
		streamsArray.push({
			sources:slaveStreamData,
			preview:slavePreview
		});
	}
}

exports.routes = {
	getVideoData: { extension:'json', get:[
		VideoController.LoadVideo,
		VideoController.CheckPublished,
		VideoController.LoadUrlFromRepository,
		function(req,res) {
			if (req.data && req.data.source) {
				var metadata = {
					"duration":req.data.duration,
					"title":req.data.title
				};
				var streams = [];

				if (req.data.source.type=="polimedia" || req.data.source.type=="external") {
					loadPolimedia(streams, req.data.source.videos, req.data.source.slaveVideos, req.data.thumbnail);
				}
				else if (req.data.source.type=="live") {
					loadLiveStream(streams, req.data.source.videos, req.data.source.slaveVideos, req.data.thumbnail);
				}

				res.json({
					"metadata":metadata,
					"streams":streams,
					"frameList":req.data.slides
				});
			}
			else {
				res.status(404).json({ status:false, message:"No such video" });
			}
		}]}
};