
var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../controllers/video');
var CommonController = require(__dirname + '/../controllers/common');
var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	listVideos: { get:[
		CommonController.Paginate,
		VideoController.LoadVideos,
		CommonController.JsonResponse] }
};