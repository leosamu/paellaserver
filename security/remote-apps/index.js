var passport = require('passport');
var express = require("express");
var DigestStrategy = require('passport-http').DigestStrategy;
var RemoteAppsUPVStrategy = require('../../passport-remote-apps-upv').Strategy;
var UserServices = require('../../services').UserServices;

var security = require("../../security");
var configure = require("../../configure");
var User = require('../../models/user.js');


var strategiesEnabled= [];

function getAuthMethodInfo(name) {
	var info = null;
	
	try {
		configure.config.auth.methods.forEach(function(m){
			if (m._id == name) {
				info = m;
			}
		});		
	}
	catch(e) {
		info = null;
	}

	return info;
}


var digestInfo = getAuthMethodInfo('digest');
var remoteAppsUpvInfo = getAuthMethodInfo('remote-apps-upv');


if ((digestInfo) && (digestInfo.enable)) {
	strategiesEnabled.push('digest');
	passport.use(new DigestStrategy({ qop: 'auth', realm: 'Users' },
		function(username, done) {
			var loginField = configure.config.security.loginField;
			var passwField = configure.config.security.passwField;
			var query = {};
			query[loginField] = username;
			
			
			var passwField = configure.config.security.passwField;			
			User.findOne(query)
				.populate('roles')			
				.exec(function(err,user) {
					if (err) {
						done(err);
					}
					else if (user) {
						var password = user;
						passwField = passwField.split('.');
						passwField.forEach(function(chunk) {
							password = password[chunk];
						});
						security.enrichUserWithRoles(user)
						.then(function(user) {
							done(null, user, password);
						});						
					}
					else {
						done(null, false);
					}
				});
		},
		function(params, done) {
			return done(null, true);
		}
	));
}


if ((remoteAppsUpvInfo) && (remoteAppsUpvInfo.enable)) {
	strategiesEnabled.push('remote-apps-upv');
	passport.use(new RemoteAppsUPVStrategy({
			UPVuser: remoteAppsUpvInfo.user,
			UPVpassword: remoteAppsUpvInfo.password,
			UPVIdUser: 'LOGIN'
		},
		function(profile, done) {				
			var UPVUserProvider = UserServices.getUserProviderByName('UPV');			
			if (UPVUserProvider) {
				UPVUserProvider.getOrCreateUserByLogin(profile.id_user)
				.then(function(user) {
					security.enrichUserWithRoles(user)
					.then(function(user) {
						done(null, user);
					});				
				})
				.catch(function(err) { done(null, false); });				
			}
			else {
				return done("UPVUserProvider not Found");
			}	
		}
	));
}


var router = express.Router();

// Remote Apps Auth
router.use(function(req, res, next){
	if (req.headers && req.headers.authorization) {	
		var ApiCallError = require('../../passport-remote-apps-upv').ApiCallError;
		passport.authenticate(strategiesEnabled, { session: false }, function(err, user, info){
			if (err) {				 
				if (err instanceof ApiCallError){
					return res.status(err.code || 500).send(err.message);
				}
				else {
					return next(err);
				}
			}
			else if (!user) {
				return res.sendStatus(500);
			}
			else {
				req.logIn(user, function(err) {
					if (err) { return next(err); }
					next();
				});
			}
		})(req, res, next);
	}	   
	else {
		next();
	}
});


module.exports.router = router;
