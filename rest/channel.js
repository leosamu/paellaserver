/**
 * Created by fernando on 15/4/15.
 */

var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../controllers/channels');
var CommonController = require(__dirname + '/../controllers/common');
var AuthController = require(__dirname + '/../controllers/auth');

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
			req.data = req.body;
			next();
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