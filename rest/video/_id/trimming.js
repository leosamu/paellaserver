var mongoose = require('mongoose');
var uuid = require('node-uuid');

var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	getTrimming: {
		get: [
			VideoController.LoadVideo,
			function(req,res,next) {
				var video = req.data[0];
				req.data = {};
				if (video.slices) {
					var trimming;
					video.slices.forEach(function(s){
						if (!trimming && (s.type == "trimming")) {
							trimming = s;
						}
					});
					if (trimming) {
						req.data = {start: trimming.start, end: trimming.end};
					}
				}
				next();
			},
			CommonController.JsonResponse
		]
	},
			
	updateTrimming: {
		patch: [
//			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
//			AuthController.LoadRoles,
//			AuthController.CheckWrite,
			function(req,res,next) {
				var video = req.data[0];
				var slice;
				if (video.slices) {
					video.slices.forEach(function(s){
						if (s.type == "trimming") {							
							s.remove();
						}
					});
				}
				else {
					video.slices = [];
				}
				
				
				var subdoc = video.slices.create({_id:uuid.v4(), type: "trimming", start: req.body.start, end: req.body.end});
				video.slices.push(subdoc);

				video.save(function (err, nn) {
					if (err) {
						res.status(500);
						req.data = { status:false, message:"Error saving trimming into video with id " + video._id };
					}
					else {
						req.data = {start: req.body.start, end: req.body.end};
					}
					next();
				});
			},
			CommonController.JsonResponse
		]
	},	
	
	deleteTrimming: {
		delete: [
//			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
//			AuthController.LoadRoles,
//			AuthController.CheckWrite,
			function(req,res,next) {
				var video = req.data[0];
				var slice;
				if (video.slices) {
					video.slices.forEach(function(s){
						if (s.type == "trimming") {							
							s.remove();
						}
					});
					video.save(function (err, nn) {
						if (err) {
							res.status(500);
							req.data = { status:false, message:"Error deleting the trimming from video " + video._id };
						}
						else {
							req.data = {status: true};
						}
						next();
					});
				}
				else {
					req.data = { status:true };
					next();
				}
			},
			CommonController.JsonResponse
		]
	}	
};