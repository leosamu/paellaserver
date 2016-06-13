var configure = require("../../configure.js");
var UserProvider = require("../../services/user-provider.js");
var User = require('../../models/user.js');

var util = require('util');
var Q = require('q');
var request = require('request');
var iconv = require('iconv-lite');

/**
 * `UPV UPVUserProvider`
 */
function UPVUserProvider() {
	UserProvider.call(this, "UPV");
}


/**
 * Inherit from `UserProvider`.
 */
util.inherits(UPVUserProvider, UserProvider);



UPVUserProvider.prototype.getOrCreateUserByAuthInfo = function(autenticateInfo) {
	var profile = autenticateInfo;
	var deferred = Q.defer();
		
	User.findOne({"auth.UPV.dni": profile.dni})
	.select('-auth.polimedia.pass')
	.exec(function(err, user) {
		if (err) { deferred.reject(err); }
		else if (user) { done(null, user); }
		else {
			getOrCreateUserByEmail(profile.email)
			.then(
				function(user){ deferred.resolve(user); },
				function(err) { deferred.reject(err); }
			)
			
		}
	});

	return deferred.promise;
}


UPVUserProvider.prototype.getOrCreateUserByEmail = function(email) {
	var deferred = Q.defer();		

	try {
		var callUser = configure.config.security.UPV.piolin.rest.deEmail.user;
		var callPass = configure.config.security.UPV.piolin.rest.deEmail.password;
	
		request.post('https://' + callUser + ':' + callPass + '@piolin.upv.es/consultas/?c=deEmail',
			{
				form:{ email: email },
				encoding:null,
				headers:{
					'Content-type': "application/x-www-form-urlencoded; charset=ISO-8859-1"
				}
			},
			function(error, response, body) {
				if (error) {
					deferred.reject(error);
				}
				else if (response.statusCode>=400) {
					deferred.reject(new Error("Error " + response.statusCode));
				}
				else {
					var roles = [];
					body = iconv.decode(body,'iso-8859-1');
					jbody = JSON.parse(body);
	
					if (jbody.dni) {
						User.findOne({"auth.UPV.dni": jbody.dni})
						.select('-auth.polimedia.pass')
						.exec(function(err, user) {
							if (err) { deferred.reject(err); }
							else if (user) {
								deferred.resolve(user);
							}
							else {
								var re = RegExp("^" + email.split('@')[0] + "@(.+\.)*upv\.es$","i");							
								User.findOne({"contactData.email":{$regex: re}})
								.select("-auth.polimedia.pass")
								.exec(function(err,user) {
									if (err) { return deferred.reject(err); }			
															
									if (user) {
										if (!user.auth) { user.auth= {}; }
										user.auth.UPV = {
											dni: jbody.dni,
											nip: jbody.nip
										};
										user.save(function(err) {
											if (err) { return deferred.reject(err); }
											deferred.resolve(user);
										});									
									}
									else {					
										var newUser = new User({
											contactData: {
												email: jbody.email,
												name: jbody.nombre,
												lastName: jbody.apellidos
											},
											auth:{
												UPV: {
													dni: jbody.dni,
													nip: jbody.nip
												}
											}
										});
										newUser.save(function(err) {
											if (err) { return deferred.reject(err); }
											deferred.resolve(newUser);
										});
									}			
				
								});
							}
						});
					}
					else {
						deferred.reject();
					}
				}
			}
		);
	}
	catch(err) {
		deferred.reject(err);
	}

	return deferred.promise;
};




module.exports = UPVUserProvider;
