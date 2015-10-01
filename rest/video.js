
var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../controllers/video');
var CommonController = require(__dirname + '/../controllers/common');
var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	getVideoData: { param:'id', get:[
		VideoController.LoadVideo,
		VideoController.CheckPublished,
		VideoController.LoadUrlFromRepository,
		AuthController.LoadRoles,
		CommonController.JsonResponse]},

	createVideo: { post:[
		AuthController.EnsureAuthenticatedOrDigest,
		function(req,res,next) {
			req.data = req.body;
			next();
		},
		VideoController.CreateVideo,
		CommonController.JsonResponse
	]},

	updateVideo: { param:'id', patch:[
		AuthController.EnsureAuthenticatedOrDigest,
		VideoController.LoadVideo,
		AuthController.LoadRoles,
		AuthController.CheckWrite,
		function(req,res,next) {
			req.data = req.body;
			next();
		},
		VideoController.UpdateVideo,
		CommonController.JsonResponse
	]}
/*

	,

	updateVideo: { param:'id', put:function(req,res) {
		var id = req.params.id
		data._id = id;
		res.json(fooResult);
	}},

	updateVideoField: { param:'id', patch:function(req,res) {
		var id = req.params.id
		fooResult._id = id;
		fooResult.title = "Vídeo " + id;
		fooResult.src = "video_" + id + ".mp4";
		fooResult[data.field] = data.value;
		res.json(fooResult);
	}},

	deleteVideo: { param:'id', delete:function(req,res) {
		var id = req.params.id
		res.json({ status:true, message:"Video deleted"});
	}}
	*/
}