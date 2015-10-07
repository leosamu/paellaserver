
var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../controllers/channels');
var CommonController = require(__dirname + '/../controllers/common');
var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	listChannels: { get:[
		CommonController.Paginate,
		function(req, res, next) {
			if (req.query.filters) {
				req.data = {query: JSON.parse(new Buffer(req.query.filters, 'base64').toString())};
			}
			next();
		},		
		ChannelController.LoadChannels,
		ChannelController.LoadUrlFromRepository,
		CommonController.JsonResponse] }
};