var configure = require("../../configure.js");
var RoleProvider = require("../../services/role-provider.js");
var util = require('util');
var Q = require('q');
var request = require('request');
var iconv = require('iconv-lite');

/**
 * `UPV UPVRoleProvider`
 */
function UPVRoleProvider() {
	RoleProvider.call(this, "UPV ROLES");
}


/**
 * Inherit from `RoleProvider`.
 */
util.inherits(UPVRoleProvider, RoleProvider);

UPVRoleProvider.prototype.getRolesForUser = function(user) {
	var deferred = Q.defer();		

	try {
		var callUser = configure.config.security.UPV.piolin.rest.deEmail.user;
		var callPass = configure.config.security.UPV.piolin.rest.deEmail.password;
	
		request.post('https://' + callUser + ':' + callPass + '@piolin.upv.es/consultas/?c=deEmail',
			{
				form:{ email: user.contactData.email },
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
	
					if (jbody.roles) {					
						jbody.roles.forEach(function(r){
							roles.push({
								_id: "ROLE_UPV_" + r,
								description: "UPV ROLE: " + r,
								isAdmin: false
							});
						})		
					}				
							
					deferred.resolve(roles);
				}
			}
		);
	}
	catch(err) {
		deferred.reject(err);
	}

	return deferred.promise;
};


UPVRoleProvider.prototype.serachRoles = function(search) {
	var deferred = Q.defer();		
		
	deferred.resolve([]);
	
	return deferred.promise;
}



module.exports = UPVRoleProvider;
