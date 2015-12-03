
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

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

function ensureFolderExists(p, mask, cb) {	
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(p, mask, function(err) {
        if (!err) {
	        return cb(null); // successfully created folder
        }
        else {
	        switch (err.code) {
	            case 'EEXIST':
	            	cb(null); // ignore the error if the folder already exists
	            	break;
	            case 'ENOENT':
	                ensureFolderExists(path.dirname(p), mask, function (err) {
	                    if (err) cb(err);
	                    else ensureFolderExists(p, mask, cb);
	                });
	                break;
	            default:
		            cb(err); // something else went wrong
	            	break;
	        }
	    }
    });
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
				var Video = require(__dirname + "/../../../models/video");
				var videoData = req.data[0];
				
				var destinationFile = videoData.repository.path + videoData._id + '/polimedia/polimedia.mp4';				
				if (videoData.source.videos.length) {
					destinationFile = videoData.source.videos[0].path;
				}
				ensureFolderExists(path.dirname(destinationFile), function(err) {
					if(err) {
						return res.status(500).json({ error:true, message:"Error uploading file." });
					}
					move(req.file.path, destinationFile, function(err) {
						if(err) {
							return res.status(500).json({ error:true, message:"Error uploading file." });
						}
						
						
						Video.update({ "_id":videoData._id},{
							$set: {
								"unprocessed": false,
								"source.videos": [{
									src: path.basename(destinationFile),
									width: 0,
									height: 0
//									recordingDate: { type:Date }									
								}]
							}
						}, function(err){
							if (err) {
								return res.status(500).json({ error:true, message:"Error uploading file." });
							}
							next();
						});
					});					
				});
			},
			TaskController.AddVideoTasks,
			CommonController.JsonResponse
		]
	}
};


