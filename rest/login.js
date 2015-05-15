var mongoose = require('mongoose');
var passport = require('passport');

var AuthController = require(__dirname + '/../controllers/auth');
var CommonController = require(__dirname + '/../controllers/common');
var CSRFController = require(__dirname + '/../controllers/csrf');

exports.routes = {
	login: { param:'login', get:[
		function(req,res,next) {
			req.data = {
				status:false,
				message:'Esto no sirve pa ná',
				user:req.user
			};
			next();
		},
		CommonController.JsonResponse
		]
	}
};
