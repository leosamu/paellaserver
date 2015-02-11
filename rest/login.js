var mongoose = require('mongoose');

var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	login: { param:'login', get:[
		AuthController.Login,
		AuthController.CurrentUser,
		function(req,res) {
			res.json({
				status:true,
				message:"Login Ok",
				user:req.userData
			});
		}]
	}
};
