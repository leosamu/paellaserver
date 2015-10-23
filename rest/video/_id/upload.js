
var mongoose = require('mongoose');
var fs = require('fs');

var ChannelController = require(__dirname + '/../../../controllers/channels');
var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');
var TaskController = require(__dirname + '/../../../controllers/task');

function move (oldPath, newPath, callback) {
	fs.rename(oldPath, newPath, function (err) {
		if (err) {
			if (err.code === 'EXDEV') {
				copy();
			} else {
				callback(err);
			}
			return;
		}
		callback();
	});

	function copy () {
		var readStream = fs.createReadStream(oldPath);
		var writeStream = fs.createWriteStream(newPath);

		readStream.on('error', callback);
		writeStream.on('error', callback);
		readStream.on('close', function () {

			fs.unlink(oldPath, callback);
		});

		readStream.pipe(writeStream);

	}
}

exports.routes = {
	upload: {
		upload:'file',
		post: [
			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideoPopulate,
			AuthController.LoadRoles,
			AuthController.CheckWrite,
			VideoController.LoadStorageDataFromRepository,
			function(req,res,next) {
				var videoData = req.data[0];
				if (videoData.source.videos.length) {
					var mainVideo = videoData.source.videos[0];
					move(req.file.path,mainVideo.path,function() {
						next();
					});
				}
				else {
					res.status(500).json({ error:true, message:"Error uploading file. " });
				}
			},
			TaskController.AddVideoTasks,
			function(req,res,next) {
				var videoData = req.data[0];
				var Video = require(__dirname + "/../../../models/video");
				Video.update({ "_id":videoData._id},{ $set:{ "unprocessed":false }})
					.then(function() {
						next();
					});
			},
			CommonController.JsonResponse
		]
	}
};


