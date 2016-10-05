var passport = require('passport');
var express = require("express");
var DigestStrategy = require('passport-http').DigestStrategy;
var RemoteAppsUPVStrategy = require('../../passport-remote-apps-upv').Strategy;

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
			// TODO: llamar a la API REST de la UPV para obtener la información de usuario de la UPV
			User.findOne({"auth.UPV.login": profile.id_user}, function(err, user){
				if (err) { return done(err); }
				
				if (user) {
					security.enrichUserWithRoles(user)
					.then(function(user) {
						done(null, user);
					});
				}
				else {
					return done(null, false);
				}
			});
	
		}
	));
}


var router = express.Router();

// Remote Apps Auth
router.use(function(req,res,next){
	if (req.headers && req.headers.authorization) {
		var parts = req.headers.authorization.split(' ');
		if (parts.length == 2) {
			var scheme = parts[0]
			var credentials = parts[1];

			passport.authenticate(strategiesEnabled, { session: false })(req, res, next);
		}
		else {
			res.sendStatus(400);
		}
	}	   
	else {
		next();
	}
});


module.exports.router = router;
