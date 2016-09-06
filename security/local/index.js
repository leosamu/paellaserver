var passport = require('passport');
var express = require("express");
var LocalStrategy = require('passport-local').Strategy;

var configure = require("../../configure");
var User = require('../../models/user.js');

var Services = require("../../services");
var LocalRoleProvider = require('./local-role-provider.js');
var LocalUserRoleProvider = require('./local-user-role-provider.js');
var LocalUserProvider = require('./local-user-provider.js');

var localRoleProvider = new LocalRoleProvider();
var localUserRoleProvider = new LocalUserRoleProvider();
var localUserProvider = new LocalUserProvider();

Services.RoleServices.registerRoleProvider(localRoleProvider);
Services.RoleServices.registerRoleProvider(localUserRoleProvider);
Services.UserServices.registerUserProvider(localUserProvider);


passport.use(new LocalStrategy(
	function(username, password, done) {
		localUserProvider.getOrCreateUserByAuthInfo({username: username, password:password})
		.then(
			function(user) {
				if (user) {
					done(null, user);
				}
				else {
					done(null, false, { message: 'Invalid username or password.'})
				}
			},
			function(err) {
				done(err);
			}
		);
	}
));


var router = express.Router();

router.post('/auth/local',
	passport.authenticate('local', {
		failureRedirect: configure.serverUrl() + '/#/auth/login',
		usernameField: 'username',
		passwordField: 'password',
		failureFlash: false }),
	function(req,res) {
		var redirect = req.body.redirect || "/";
		res.redirect(redirect);
	}
);

router.post('/rest/auth/local', function(req, res, next) {
	passport.authenticate('local',
		{
			usernameField:'username',
			passwordField:'password'
		},
		function(error, user, info) {
			if (error) {
				return res.status(500).send({ status:false, message:error.toString() });
			}
			else if (!user) {
				return res.status(403).send({ status:false, message:info.message });
			}
			else {
				req.logIn(user, function(err) {
					if (err) {
						return res.status(500).send({ status:false, message:err.toString() });
					}
					else {
						return res.send({ status:true, message:"Login successfull" });
					}
				})
			}
	
		}
	)(req,res,next);
});





module.exports.router = router;
