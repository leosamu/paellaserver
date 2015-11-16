var mongoose = require('mongoose');
var uuid = require('node-uuid');

var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	getBreaks: {
		get: [
			VideoController.LoadVideo,
			function(req,res,next) {
				var video = req.data[0];
				req.data = {};
				if (video.slices) {
					var breaks = [];
					
					video.slices.forEach(function(s){
						if (s.type == "breaks") {
							breaks.push({start: s.start, end: s.end});
						}
					});
					req.data = breaks;
				}
				next();
			},
			CommonController.JsonResponse
		]
	},
			
	updateBreaks: {
		patch: [
//			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
//			AuthController.LoadRoles,
//			AuthController.CheckWrite,
			function(req,res,next) {
				var video = req.data[0];
				if (video.slices) {
					var toRemove = []
					video.slices.forEach(function(s){
						if (s.type == "breaks") {							
							toRemove.push(s);
						}
					});
					toRemove.forEach(function(s){
						s.remove();
					});
				}
				else {
					video.slices = [];
				}
				
				req.body.forEach(function(b){
					var subdoc = video.slices.create({_id:uuid.v4(), type: "breaks", start: b.start, end: b.end});
					video.slices.push(subdoc);					
				})

				video.save(function (err, nn) {
					if (err) {
						res.status(500);
						req.data = { status: false, message:"Error saving breaks into video with id " + video._id };
					}
					else {
						req.data = {status: true};
					}
					next();
				});
			},
			CommonController.JsonResponse
		]
	},	
	
	deleteBreaks: {
		delete: [
//			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
//			AuthController.LoadRoles,
//			AuthController.CheckWrite,
			function(req,res,next) {
				var video = req.data[0];
				var slice;
				if (video.slices) {
					var toRemove = []
					video.slices.forEach(function(s){
						if (s.type == "breaks") {							
							toRemove.push(s);
						}
					});
					toRemove.forEach(function(s){
						s.remove();
					});
					video.save(function (err, nn) {
						if (err) {
							res.status(500);
							req.data = { status:false, message:"Error deleting breaks from video " + video._id };
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