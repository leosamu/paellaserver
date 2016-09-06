var passport = require('passport');
var express = require("express");
var User =require("./models/user.js");

var configure = require("./configure");
var RoleServices = require("./services/role-services.js");

var securityLocal = require("./security/local")
var securityUPV = require("./security/UPV")
var securityDigest = require("./security/digest")


passport.serializeUser(function(user, done) {
	User.populate(user, [{path:"roles"}], function(err, user){			
		RoleServices.getRolesForUser(user)
		.then(function(roles){
			roles.forEach(function(r){
				user.roles.push(r);
			});
		})
		.finally(function() {
			//user.roles.push({_id: 'USER_' + user["_id"], description: "Role for user: " + user.contactData.name + " " + user.contactData.lastName, isAdmin: false});
			done(null, user);
		});			
	});
	
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);	
});



var router = express.Router();
router.get('/auth/logout', function(req, res){
	req.logout();
	req.session.destroy();
	res.redirect('/');
});
router.use(securityLocal.router);
router.use(securityUPV.router);




module.exports.router = router;
