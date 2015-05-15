var passport = require('passport');
var express = require("express");


var LocalStrategy = require('passport-local').Strategy;
var DigestStrategy = require('passport-http').DigestStrategy;

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
			.exec(done);
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

	router.get('/auth/logout', function(req, res){
		req.logout();
		req.session.destroy();
		res.redirect('/');
	});

	/*router.get('/auth/local', function(req, res) {
	 var template = i18n.t('template.login');
	 res.render(template, { title: 'Servicio de VideoApuntes', user: req.user, message: req.flash('error') });
	 });*/

	router.post('/auth/local',
		passport.authenticate('local', {
			failureRedirect: configure.serverUrl() + '/#/auth/local/401',
			usernameField:'username',
			passwordField:'password',
			failureFlash: false }),
		function(req,res) {
			res.redirect('/');
		}
	);

};

