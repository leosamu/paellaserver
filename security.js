var passport = require('passport');
var express = require("express");


var LocalStrategy = require('passport-local').Strategy;
var DigestStrategy = require('passport-http').DigestStrategy;
var OpenIDStrategy = require('passport-openid').Strategy;
var UPVStrategy = require('./passport-upv').Strategy;


function getUPVRoles(user,done) {
	try {
		var oracledb = require('oracledb');
		var dbConfig = require('./dbconfig.json');
		
		var dni = user.auth.UPV.dni;//20455441
		
		oracledb.getConnection( dbConfig, function(err, connection) {
			if (err) {
			  done(null,user);
			  return
			}
			connection.execute(
			    "SELECT * FROM SAK_VAPUNTES_ALUMNOS_VW where usuario = lower('" + dni + "')",
			    {},
				function(err, result)
					{
					if (err) {
					}
					else {
						var columns = {};
						result.metaData.forEach(function(c, idx){
							columns[c.name] = idx;
						});
						
						result.rows.forEach(function(r){
							var role1 = ["ROLE", r[columns.TIPOASI], r[columns.ASI], r[columns.EDICION], r[columns.PERFIL]].join("_").toUpperCase();
							var role2 = ["ROLE", r[columns.TIPOASI], r[columns.ASI], r[columns.PERFIL]].join("_").toUpperCase();
							user.roles.push(role1);
							user.roles.push(role2);
						});
					}
					// Release
					connection.release(function(err) {
					});
					
					done(null,user);
				}
			);	
		});

	}
	catch(e) {
		done(null,user);
	}
}

exports.init = function(app) {
	var configure = require("./configure");
	var router = express.Router();
	app.use(router);

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(obj, done) {
		var User = require('./models/user');
		var passwField = configure.config.security.passwField;
		User.findOne({"_id":obj})
			.select('-' + passwField)
			.populate('roles')
			.exec(function(err,data) {
				getUPVRoles(data,done);
			});
	});

	passport.use(new LocalStrategy(
		function(username, password, done) {
			var User = require('./models/user.js');
			var query = {};
			var loginField = configure.config.security.loginField;
			var passwField = configure.config.security.passwField;
			query[loginField] = username;
			query[passwField] = password;
			User.findOne(query)
				.exec(function(err,data) {
					if (err) {
						done(err);
					}
					else if (data) {
						done(null, data)
					}
					else {
						done(null, false, { message: 'Invalid username or password.' })
					}
				});
		}
	));

	passport.use(new DigestStrategy({ qop: 'auth', realm: 'Users' },
		function(username, done) {
			var User = require('./models/user.js');
			var loginField = configure.config.security.loginField;
			var passwField = configure.config.security.passwField;
			var query = {};
			query[loginField] = username;
			User.findOne(query)
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
						done(null, user, password);
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


	passport.use(new OpenIDStrategy({
			returnURL: configure.serverUrl() + '/auth/openid/return',
			realm: configure.serverUrl(),
			profile: true
		},
		function(identifier, profile, done) {
			// TODO: Implementar OpenID si se considera útil.
			console.log(identifier);
			console.log(profile);
			done(null, false);
		}
	));
	
	passport.use(new UPVStrategy({
			cua: "https://www.upv.es/pls/soalu/est_intranet.NI_dual?P_CUA=media",
			tickets: ["TDP", "TDX", "TDp"],
			profileInfo: ['nip', 'dni', 'login', 'email', 'fullName']
		},
		function(profile, done){
			function addUserData() {
				var newUser = null;
				var re = RegExp("^" + profile.email.split('@')[0] + "@(.+\.)*upv\.es$","i");
				
				User.findOne({"contactData.email":{$regex:re}})
					.select("-auth.polimedia.pass")
					.exec(function(err,user) {
						if (err) { return done(err); }
						
						if (!user) {
							var nameArray = profile.fullName.split(',');
							newUser = new User({
								contactData: {
									email:profile.email,
									name:nameArray[1].trim(),
									lastName:nameArray[0].trim()
								},
								auth:{
									UPV: {
										login:profile.login,
										dni:profile.dni,
										nip:profile.nip
									}
								}
							});
							newUser.save(function(err) {
								if (err) { return done(err); }
								return done(null, newUser);
							});
						}
						else {
							newUser = user;
							newUser.auth.UPV = {
										login:profile.login,
										dni:profile.dni,
										nip:profile.nip
									}
							User.update({"contactData.email":{$regex:re}},
								{ $set:{"auth.UPV":newUser.auth.UPV }})
								.exec(function(err) {
									if (err) { return done(err); }
									return done(null, newUser);
								});
						}
					});
			}
			
			var User = require('./models/user.js');
			User.findOne({"auth.UPV.dni":profile.dni})
				.select('-auth.polimedia.pass')
				.exec(function(err,user) {
					if (err) { done(err); }
					else if (user) { done(null, user); }
					else {
						addUserData();
					}
				});
		}
	));


	router.get('/auth/logout', function(req, res){
		req.logout();
		req.session.destroy();
		res.redirect('/');
	});

	router.post('/auth/openid', function(req,res,next) {
			next();
		},
		passport.authenticate('openid'));
		
	router.get('/auth/openid/return',
		passport.authenticate('openid', { successRedirect: '/',
			failureRedirect: '/#/auth/login/401'
		}));

	router.post('/auth/local',
		passport.authenticate('local', {
			failureRedirect: configure.serverUrl() + '/#/auth/local',
			usernameField:'username',
			passwordField:'password',
			failureFlash: false }),
		function(req,res) {
			var redirect = req.body.redirect || "/";
			res.redirect(redirect);
		}
	);
	
	router.get('/auth/upv',
		function(req,res,next) {
			req.session.redirect = req.query.redirect;
			next();
		},
		passport.authenticate('upv', {}),
		function(req,res) {
			var redirect = req.session.redirect || "/";
			res.redirect(redirect);
		}
	);

	router.get('/rest/plugins/upvauth/validate',
		passport.authenticate('upv', {}),
		function(req,res) {
			var redirect = req.session.redirect || "/";
			res.redirect(redirect);
		}
	);
};

