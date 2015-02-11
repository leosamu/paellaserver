var mongoose = require('mongoose');

var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	login: { get:[
		AuthController.Logout,
		function(req,res) {
			res.json({
				status:true,
				message:"Logout Ok"
			});
		}]
	}
};
