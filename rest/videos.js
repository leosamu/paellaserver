
var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../controllers/video');
var CommonController = require(__dirname + '/../controllers/common');
var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	listVideos: { get:[
		CommonController.Paginate,
		VideoController.LoadVideos,
		CommonController.JsonResponse] },

	getVideoData: { param:'id', get:[
		VideoController.LoadVideo,
    	VideoController.LoadUrlFromRepository,
		CommonController.JsonResponse]},

	createVideo: { post:[
		AuthController.CheckAccess(['ADMIN','USER']),
		function(req,res) {
			res.json({
				status:true,
				message:"Ok"
			})
		}]

		//function(req,res) {
		//var id = req.params.id
		//var fooResult = {}
    	//fooResult._id = 5;
    	//fooResult.title = data.title;
    	//fooResult.src = data.src;
    	//res.json(fooResult);
    	//}
	},

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
}