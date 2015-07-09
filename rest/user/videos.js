var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../controllers/video');
var CommonController = require(__dirname + '/../../controllers/common');
var AuthController = require(__dirname + '/../../controllers/auth');
var UserController = require(__dirname + '/../../controllers/user');

exports.routes = {
	getUserVideos: {
		get: [
			UserController.Authors('polimedia'),
			CommonController.JsonResponse ]
	}
};