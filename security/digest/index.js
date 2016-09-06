var passport = require('passport');
var express = require("express");
var DigestStrategy = require('passport-http').DigestStrategy;

var configure = require("../../configure");
var User = require('../../models/user.js');


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


