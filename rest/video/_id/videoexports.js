var mongoose = require('mongoose');
var uuid = require('node-uuid');

var VideoExportModel = require(__dirname + '/../../../models/videoexport');

var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	getVE: {
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
			AuthController.LoadRoles,
			AuthController.CheckWrite,
			function(req,res,next) {
				VideoExportModel.find({ "video":req.params.id})
				.exec(function(err, data) {
					if (err) {
						res.status(500);
						req.data = { status:false, message:""};
					}
					else {
						req.data = data;
					}
					next();
				});			
			},
			CommonController.JsonResponse
		]
	},
		
	getVEId: {
		param:'videoExportId',
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
			AuthController.LoadRoles,
			AuthController.CheckWrite,
			function(req,res,next) {
				VideoExportModel.findOne({_id:req.params.videoExportId, video: req.params.id})
				.exec(function(err, item) {
					if(err) { return res.sendStatus(500); }
					
					if (item) {
						res.status(200).send(item);
					}
					else {
						res.sendStatus(404);
					}
				});	
			}
		]
	},	
	newVE: {
		post: [
			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
			AuthController.LoadRoles,
			AuthController.CheckWrite,
			function(req,res,next) {
				req.body.video = req.params.id;
				req.body.user = req.user._id;
				var item = new VideoExportModel(req.body);				
				item.save(function(err) {
					if(!err) {
						res.status(201);
						res.send(item);
					}
					else {
						res.sendStatus(500);
					}
				});			
			}
		]
	},	
	
	setVEId: {
		param:'videoExportId',
		patch: [
			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
			AuthController.LoadRoles,
			AuthController.CheckWrite,
			function(req,res,next) {
				VideoExportModel.findByIdAndUpdate({"_id": req.params.videoExportId }, req.body, function(err, item) {
					if(err) { return res.sendStatus(500); }
					if (item) {
						res.status(204).send(item);
					}
					else {
						res.sendStatus(500);
					}
				});				
			}
		]
	},	
	
	deleteVEId: {
		param:'videoExportId',
		delete: [
			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
			AuthController.LoadRoles,
			AuthController.CheckWrite,
			function(req,res,next) {
				VideoExportModel.remove({"_id": req.params.videoExportId }, function(err, todo) {
					if (!err) {
						res.sendStatus(204);
					}
					else {
						res.sendStatus(500);
					}
			    });
			}
		]
	}
};