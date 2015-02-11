var mongoose = require('mongoose');

var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	getCurrentUser: { get:[
		AuthController.CurrentUser,
		function(req,res) {
			if (req.userData) {
				res.json({
					status:true,
					message:"Command executed successfully",
					user:req.userData
				});
			}
			else {
				res.json({
					status:false,
					message:"No user logged in"
				})
			}
		}]
	}
};
