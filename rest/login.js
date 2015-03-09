var mongoose = require('mongoose');

var AuthController = require(__dirname + '/../controllers/auth');
var CommonController = require(__dirname + '/../controllers/common');
var CSRFController = require(__dirname + '/../controllers/csrf');

exports.routes = {
	login: { param:'login', get:[
		AuthController.Login,
		AuthController.CurrentUser,
		function(req,res,next) {
			req.data = {
				status:true,
				message:'Login Ok',
				user:req.userData
			};
			next();
		},
		CommonController.JsonResponse
		]
	}
};
