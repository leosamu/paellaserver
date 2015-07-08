var mongoose = require('mongoose');

var AuthController = require(__dirname + '/../../controllers/auth');
var CommonController = require(__dirname + '/../../controllers/common');
var UserController = require(__dirname + '/../../controllers/user');

exports.routes = {
	search: { param:'search', get:[
		AuthController.EnsureAuthenticatedOrDigest,
		AuthController.CheckRole(['ADMIN','YOUTUBE']),
		UserController.Search('auth.UPV.dni'),
		CommonController.JsonResponse
	]}
};
