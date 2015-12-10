var passport = require('passport');
var express = require("express");


var LocalStrategy = require('passport-local').Strategy;
var DigestStrategy = require('passport-http').DigestStrategy;
var OpenIDStrategy = require('passport-openid').Strategy;
var UPVStrategy = require('./passport-upv').Strategy;
var LTIStrategy = require('passport-lti').Strategy;

var configure = require("./configure");


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
				data.roles.push('ROLE_' + data["_id"]);
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
									};
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


	function getOrCreateUser(user) {	
		var UPVController = require(__dirname + '/controllers/upv');
		var Q = require("q");
		var User = require('./models/user');
		
		var deferred = Q.defer();
		
		// Buscamos al usuario en Piolin
		UPVController.Utils.userByEmail(user.contactData.email)
		.then(function(data) {
			// Existe en piolin, ahora lo buscamos en nuestra base de datos para actualizar datos
			User.findOne({ "$or": [
				{ "auth.UPV.dni": data.dni },
				{ "contactData.email": data.email },
			]})
			.select("-auth.polimedia.pass")
			.exec(function(err, dbuser){
				if (err)  { return deferred.reject(new Error("Error " + err.message)); }			
				if (!dbuser) {
					// Si no existe el usuario, lo creamos
					user.save(function(err) {
						if (err)  { return deferred.reject(new Error("Error " + err.message)); }
						return deferred.resolve(user);
					});					
				}
				if (dbuser) {
					// Si el usuario existe, ¿¿¿ lo actualizamos ????
					return deferred.resolve(dbuser);
				}				
			})
		})
		.fail(function(err) {
			// No existe el usuario en Piolin, lo buscamos en nuestra base de datos
			var re = RegExp("^" + user.contactData.email.split('@')[0] + "@(.+\.)*upv\.es$","i");
			User.findOne({"contactData.email":{$regex:re}})
			.select("-auth.polimedia.pass")
			.exec(function(err, dbuser) {
				if (err)  { return deferred.reject(new Error("Error " + err.message)); }
				if (dbuser) { return deferred.resolve(dbuser); }			
				// create the user and return			
				user.save(function(err) {
					if (err)  { return deferred.reject(new Error("Error " + err.message)); }
					return deferred.resolve(user);
				});
			});
		});
		
		return deferred.promise;
	}


	passport.use('lti', new LTIStrategy({
			consumerKey: configure.config.lti.consumerKey,
			consumerSecret: configure.config.lti.consumerSecret,
			passReqToCallback: true,
			// https://github.com/omsmith/ims-lti#nonce-stores
			// nonceStore: new RedisNonceStore('testconsumerkey', redisClient)
		}, 
		function(req, lti, done) {
			req.lti = lti;	

			var User = require('./models/user');
			var newUser = new User({
				contactData: {
					name: lti.lis_person_name_given.trim(),
					lastName: lti.lis_person_name_family.trim(),
					email: lti.lis_person_contact_email_primary.trim(),
				},
				auth:{
					UPV: {
						dni: lti.user_id
					}
				}
			});
			
			getOrCreateUser(newUser)
			.then(function(user) {
				return done(null, user);
			})
			.fail(function(err){
			console.log("fail");
				return done(true);
			});
		})
	);
	app.post('/lti',
		passport.authenticate('lti', { session: true }),
		function(req, res) {		
			if (req.lti && req.lti.context_id) {
				var Channel = require('./models/channel');							
				Channel.findOne({"pluginData.sakai.code": req.lti.context_id}).exec(function(err, channel){
					if (err) { res.sendStatus(500); }
					if (channel) { res.redirect("/embed.html#/catalog/channel/"+channel._id); }
					
					if (!channel) {
						// TODO: Crear el canal automaticamente? o devolver un error?
						//res.redirect("/#/catalog/channel/02a1b342-a2ed-8048-bc68-9c439e0507ce"); 
						res.send("<h1>No hay videos disponibles en este site</h1><p>Si lo desea puede acceder al <a href='https://media.upv.es' target='_blank'>catálogo</a> de videos de la UPV.</p>");
					}
					
				});						
			}
			else {
				res.sendStatus(401);
			}		
		}
	);	


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
			failureRedirect: '/#/auth/login'
		}));

	router.post('/auth/local',
		passport.authenticate('local', {
			failureRedirect: configure.serverUrl() + '/#/auth/login',
			usernameField:'username',
			passwordField:'password',
			failureFlash: false }),
		function(req,res) {
			var redirect = req.body.redirect || "/";
			res.redirect(redirect);
		}
	);

	router.post('/rest/auth/local', function(req,res,next) {
		passport.authenticate('local', {
			usernameField:'username',
			passwordField:'password'
		},
		function(error,user,info) {
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

		})(req,res,next);
	});

	router.get('/rest/auth/logout', function(req, res){
		req.logout();
		req.session.destroy();
		res.send({ status:true, message:"logout successfull"});
	});
/*
		passport.authenticate('local', {
			failureRedirect: configure.serverUrl() + '/#/auth/login',
			usernameField:'username',
			passwordField:'password',
			failureFlash: false }),
		function(req,res) {
			var redirect = req.body.redirect || "/";
			res.redirect(redirect);
		}
	);*/

	
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

