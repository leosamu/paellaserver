var fs = require('fs');
var path = require('path');

var Channel = require(__dirname + '/../models/channel');
var Catalog = require(__dirname + '/../models/catalog');
var Repository = require(__dirname + '/../models/repository');

var ChannelController = require(__dirname + '/../controllers/channels');
var CommonController = require(__dirname + '/../controllers/common');
var AuthController = require(__dirname + '/../controllers/auth');

var catalogId = "politube";

exports.routes = {
	getChannelData: { param:'id', get:[
		ChannelController.LoadChannel,
		ChannelController.LoadUrlFromRepository,
		CommonController.JsonResponse]
	},

	createChannel: { post:[
		AuthController.EnsureAuthenticatedOrDigest,
		//AuthController.CheckAccess(['ADMIN']),
		function(req,res,next) {					
			Catalog.findOne({ "_id": catalogId })
			.populate('defaultRepositoryForChannels')
			.exec(function(err, catalog) {
				if (err) return res.sendStatus(500);
								
				req.data = req.body;									
				req.data.catalog =  catalogId;
				req.data.repository = catalog.defaultRepositoryForChannels;
				req.data.owner = [req.user._id];
				req.data.creationDate = new Date();					
				
				next();										
			});			
		},
		ChannelController.CreateChannel,
		CommonController.JsonResponse
	]},

	// Update all the channel fields with the contents of request.body
	updateChannel: { param:'id', patch:[
		AuthController.EnsureAuthenticatedOrDigest,
		ChannelController.LoadChannel,
		AuthController.LoadRoles,
		AuthController.CheckWrite,
		function(req,res,next) {
			req.data = req.body;
			next();
		},
		ChannelController.UpdateChannel,
		CommonController.JsonResponse
	]},

	// Update only the fields specified in request.body
	patchChannel: { param:'id', patch:[
		AuthController.EnsureAuthenticatedOrDigest,
		ChannelController.LoadChannel,
		AuthController.LoadRoles,
		AuthController.CheckWrite,
		function(req,res,next) {
			req.data = req.body;
			next();
		},
		ChannelController.PatchChannel,
		CommonController.JsonResponse
	]},

	removeChannel: { param:'id', delete:[
		AuthController.EnsureAuthenticatedOrDigest,
		ChannelController.LoadChannel,
		AuthController.LoadRoles,
		AuthController.CheckWrite,
		ChannelController.RemoveChannel,
		CommonController.JsonResponse
	]}
};