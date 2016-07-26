var passport = require('passport');
var LTIStrategy = require('passport-lti').Strategy;
var Q = require("q");

var Channel = require(__dirname + '/../../../models/channel');
var Catalog = require(__dirname + '/../../../models/catalog');
var User = require('../../../models/user');

var UPVController = require(__dirname + '/../../../controllers/upv');
var AuthController = require(__dirname + '/../../../controllers/auth');

var configure = require("../../../configure.js");

var UserServices = require("../../../services/user-services.js"); 



exports.routes = {};

if (configure.config.lti) {
	passport.use('lti', new LTIStrategy({
			consumerKey: configure.config.lti.consumerKey,
			consumerSecret: configure.config.lti.consumerSecret,
			passReqToCallback: true,
			// https://github.com/omsmith/ims-lti#nonce-stores
			// nonceStore: new RedisNonceStore('testconsumerkey', redisClient)
		},
		function(req, lti, done) {
			req.lti = lti;
	
			var ltiUser = {
				contactData: {
					name: lti.lis_person_name_given.trim(),
					lastName: lti.lis_person_name_family.trim(),
					email: lti.lis_person_contact_email_primary.trim(),
				},
				auth:{}
			};
	
			function getUPVUserByLTIInfo(lti) { 
				var deferred = Q.defer();
				var upvUserProvider = UserServices.getUserProviderByName('UPV');
				if (upvUserProvider) {
					upvUserProvider.getOrCreateUserByEmail(lti.lis_person_contact_email_primary.trim())
					.then(
						function(user) {
							deferred.resolve(user);
						},
						function(err) {
							deferred.reject(err);
						}
					);		
				}
				else {
					deferred.reject();
				}
				
				return deferred.promise;
			}	
	
			getUPVUserByLTIInfo(lti)
			.then(
				function(user) {
					done(null, user);
				},
				function(err) {					
					UserServices.findUserByEmail(ltiUser.contactData.email)
					.then(
						function(user) {
							done(null, user);
						},
						function(err) {							
							var newUser = new User(ltiUser);
							newUser.save(function(err){
								if (err) {
									done(err);
								}
								else {
									done(null, newUser);
								}
							});
						}
					)
				}
			)
		})
	);



	function getOrCreateLTIChannel(lti) {
		var deferred = Q.defer();
		
		Channel.findOne({"pluginData.sakai.code": lti.context_id}, function(err, channel){
			if (err) { 
				return deferred.reject();
			}
			else if (channel) {
				deferred.resolve(channel);
			}
			else {
				var newChannel = new Channel({
				    "title" : lti.context_title + " (" + lti.context_id + ")",
				    "permissions": [],
				    "videos" : [],
				    "children" : [],				    
				    "owner" : [],
				    "creationDate" : new Date(),
				    "pluginData" : {
				        "sakai" : {
				            "code" : lti.context_id
				        }
				    },
				    "videosQuery" : {
				        "objectQuery" : "{\"pluginData.sakai.codes\":\"" +lti.context_id+"\"}"
				    },				    
				    
				    "repository" : "channels_imported",
				    "catalog" : "videoapuntes",				    
				});
				
				newChannel.save(function(err){
					if (err) {
						deferred.reject();	
					}
					else {
						newChannel.updateSearchIndex();
						deferred.resolve(newChannel);
					}
				})
			}
		});		
				
		return deferred.promise;
	}

	exports.routes = {
		lti: { 
			post: [
				passport.authenticate('lti', { session: true }),
				function(req, res) {
					if (req.lti && req.lti.context_id) {
					
						getOrCreateLTIChannel(req.lti)
						.then(
							function(channel) {
								var isTeacher = false;
								req.lti.roles.forEach(function(r){
									if (r.toUpperCase() == "INSTRUCTOR") {
										isTeacher = true;
									}
								});
								if (req.lti.ext_sakai_role == "ayudante" || req.lti.ext_sakai_role == "profesor") {
									isTeacher = true;
								}


								if (isTeacher) {
									res.redirect("/embed.html#/videoapuntes/teacher/" + req.lti.context_id);
								}
								else {
									res.redirect("/embed.html#/videoapuntes/student/" + req.lti.context_id);									
								}
							},
							function(err) {
								res.send("<h1>ERROR</h1><p>"+err+"</p>");
							}
						);						
					}
					else {
						res.sendStatus(401);
					}
				}			
			]
		}	
	}
}


