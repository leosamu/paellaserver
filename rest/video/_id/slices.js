var mongoose = require('mongoose');
var uuid = require('node-uuid');

var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	getSlices: {
		get: [
			VideoController.LoadVideo,
			function(req,res,next) {
				var video = req.data[0];
				if (video.slices) {
					req.data = video.slices;
				}
				else {
					req.data = [];
				}
				next();
			},
			CommonController.JsonResponse
		]
	},
		
	getSliceId: {
		param:'sliceId',
		get: [
			VideoController.LoadVideo,
			function(req,res,next) {
				var video = req.data[0];
				var slice;
				if (video.slices) {
					slice = video.slices.id(req.params.sliceId);
				}
				if (slice) {
					req.data = slice;
				}
				else {					
					res.status(404);
					req.data = { status:false, message:"No such slice with id " + req.params.sliceId};
				}
				next();
			},
			CommonController.JsonResponse
		]
	},
	
	newSlice: {
		post: [
//			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
//			AuthController.LoadRoles,
//			AuthController.CheckWrite,
			function(req,res,next) {
				var video = req.data[0];
				
				if (!video.slices) {
					video.slices = [];
				}
				req.body._id = uuid.v4();
				var subdoc = video.slices.create(req.body);
				video.slices.push(subdoc);
				
				video.save(function (err, nn) {
					if (err) {
						res.status(500);
						req.data = { status:false, message:"Error saving a new slice into video with id " + video._id };
					}
					else {
						req.data = subdoc;
					}
					next();
				});
			},
			CommonController.JsonResponse
		]
	},	
	
	setSliceId: {
		param:'sliceId',
		patch: [
//			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
//			AuthController.LoadRoles,
//			AuthController.CheckWrite,
			function(req,res,next) {
				var video = req.data[0];
				var slice;
				if (video.slices) {
					slice = video.slices.id(req.params.sliceId);
				}
				if (slice) {
					slice.remove();
					req.body._id = req.params.sliceId;
					var subdoc = video.slices.create(req.body);
					video.slices.push(subdoc);					
					video.save(function (err, nn) {
						if (err) {
							res.status(500);
							req.data = { status:false, message:"Error updating the sli,ce " + req.params.sliceId + " from video " + video._id };
						}
						else {
							req.data = subdoc;
						}
						next();
					});										
				}
				else {					
					res.status(404);
					req.data = { status:false, message:"No such slice with id " + req.params.sliceId};
					next();
				}		
			},
			CommonController.JsonResponse
		]
	},	
	
	deleteSliceId: {
		param:'sliceId',
		delete: [
//			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
//			AuthController.LoadRoles,
//			AuthController.CheckWrite,
			function(req,res,next) {
				var video = req.data[0];
				var slice;
				if (video.slices) {
					slice = video.slices.id(req.params.sliceId);
				}
				if (slice) {
					slice.remove();									
					video.save(function (err, nn) {
						if (err) {
							res.status(500);
							req.data = { status:false, message:"Error deleting the slice " + req.params.sliceId + " from video " + video._id };
						}
						else {
							req.data = {status: true};
						}
						next();
					});										
				}
				else {					
					res.status(404);
					req.data = { status:false, message:"No such slice with id " + req.params.sliceId};
					next();
				}
			},
			CommonController.JsonResponse
		]
	}	
};