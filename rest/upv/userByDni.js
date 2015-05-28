var mongoose = require('mongoose');

var AuthController = require(__dirname + '/../../controllers/auth');
var CommonController = require(__dirname + '/../../controllers/common');
var UserController = require(__dirname + '/../../controllers/user');

exports.routes = {
	search: { param:'search', get:[
		AuthController.CheckAccess('ADMIN'),
		UserController.Search('auth.UPV.dni'),
		CommonController.JsonResponse
	]}
};