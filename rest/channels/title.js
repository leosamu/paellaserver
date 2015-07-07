var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../../controllers/channels');
var CommonController = require(__dirname + '/../../controllers/common');
var AuthController = require(__dirname + '/../../controllers/auth');

exports.routes = {
	setYoutubeId: {
		param:'title',
		get: [
			ChannelController.Where("this.title==':title'",'-search -processSlides'),
			CommonController.JsonResponse
		]
	}
};

