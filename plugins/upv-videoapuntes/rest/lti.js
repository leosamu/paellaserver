var passport = require('passport');
var LTIStrategy = require('passport-lti').Strategy;
	var Q = require("q");

var Channel = require(__dirname + '/../../../models/channel');
var User = require('../../../models/user');

var UPVController = require(__dirname + '/../../../controllers/upv');
var AuthController = require(__dirname + '/../../../controllers/auth');

var configure = require("../../../configure.js");



function getOrCreateUser(user) {	
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

exports.routes = {
	lti: { 
		post: [
			passport.authenticate('lti', { session: true }),
			function(req, res) {
				if (req.lti && req.lti.context_id) {
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
		]
	}	
}
