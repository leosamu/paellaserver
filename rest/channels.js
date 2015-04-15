
var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../controllers/channels');
var CommonController = require(__dirname + '/../controllers/common');
var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	listChannels: { get:[
		CommonController.Paginate,
		ChannelController.LoadChannels,
		CommonController.JsonResponse] }
};