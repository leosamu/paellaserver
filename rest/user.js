
var mongoose = require('mongoose');

var UserController = require(__dirname + '/../controllers/user');
var CommonController = require(__dirname + '/../controllers/common');
var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	getUserData: { param:'id', get:[
		UserController.LoadBasicUserData,
		CommonController.JsonResponse]}
};