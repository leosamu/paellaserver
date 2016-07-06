
var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../controllers/video');
var CommonController = require(__dirname + '/../controllers/common');
var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	listVideos: { get:[
		CommonController.Paginate,
		function(req, res, next) {
			if (req.query.filters) {
				req.data = {query: JSON.parse(new Buffer(req.query.filters, 'base64').toString())};
			}
			next();
		},				
		VideoController.LoadVideos,
		AuthController.LoadRoles,
		CommonController.JsonResponse] }
};