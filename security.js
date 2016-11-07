var passport = require('passport');
var express = require("express");
var User =require("./models/user.js");

var configure = require("./configure");
var RoleServices = require("./services/role-services.js");
var securityLocal = require("./security/local")
var securityUPV = require("./security/UPV")
var securityRemoteApps = require("./security/remote-apps")

var Q = require('q');


function enrichUserWithRoles(user) {
	var deferred = Q.defer();

	User.populate(user, [{path:"roles"}], function(err, user){
		RoleServices.getRolesForUser(user)
		.then(function(roles){
			roles.forEach(function(r){
				user.roles.push(r);
			});
		})
		.finally(function() {
			deferred.resolve(user);
		});
	});	
	
	return deferred.promise;
}

passport.serializeUser(function(user, done) {
	enrichUserWithRoles(user)
	.then(function(user) {
		done(null, user);
	});
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);	
});




var router = express.Router();

// Logout ROUTE
router.get('/auth/logout', function(req, res){
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

// Remote Apps Authentication
router.use(securityRemoteApps.router);
// Local Authentication
router.use(securityLocal.router);
// UPV Authentication
router.use(securityUPV.router);




module.exports.router = router;
module.exports.enrichUserWithRoles = enrichUserWithRoles;
