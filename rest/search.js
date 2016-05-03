
var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../controllers/channels');
var SearchController = require(__dirname + '/../controllers/search');
var CommonController = require(__dirname + '/../controllers/common');
var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	listChannels: { get:[
		CommonController.Paginate,
		SearchController.Search,
		SearchController.LoadUrlFromRepository,
		AuthController.LoadRoles,
		CommonController.JsonResponse] }
};