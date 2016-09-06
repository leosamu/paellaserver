var configure = require("../../configure.js");
var RoleProvider = require("../../services/role-provider.js");
var util = require('util');
var Q = require('q');
var request = require('request');
var iconv = require('iconv-lite');

/**
 * `UPVSakaiRoleProvider`
 */
function UPVSakaiRoleProvider() {
	RoleProvider.call(this, "SAKAI ROLES");
}


/**
 * Inherit from `RoleProvider`.
 */
util.inherits(UPVSakaiRoleProvider, RoleProvider);

UPVSakaiRoleProvider.prototype.getRolesForUser = function(user) {
	var deferred = Q.defer();		

	try {
		var callUser = configure.config.security.UPV.piolin.rest.asignaturas.user;
		var callPass = configure.config.security.UPV.piolin.rest.asignaturas.password;
	
		request.post('https://' + callUser + ':' + callPass + '@piolin.upv.es/consultas/?c=asignaturas',
			{
				form:{ correo: user.contactData.email },
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
	
					jbody.forEach(function(s) {
					
						roles.push({
							_id: "ROLE_SAKAI_" + s.cod_poliformat, // + "_" + s.rol.toUpperCase(),
							description: s.asignatura + " (" + s.cod_poliformat + ")",
							isAdmin: false
						});					
					});
					
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


UPVSakaiRoleProvider.prototype.serachRoles = function(search) {
	var deferred = Q.defer();

	try {
		var callUser = configure.config.security.UPV.piolin.rest.buscaAsignaturas.user;
		var callPass = configure.config.security.UPV.piolin.rest.buscaAsignaturas.password;
	
		request.post('https://' + callUser + ':' + callPass + '@piolin.upv.es/consultas/?c=buscaAsignaturas',
			{
				form:{ texto: search },
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
	
					jbody.forEach(function(s) {
						roles.push({
							_id: "ROLE_SAKAI_" + s.cod_poliformat,
							description: s.asignatura + " (" + s.cod_poliformat + ")",
							isAdmin: false
						});
					});
					
					deferred.resolve(roles);
				}
			}
		);
	}
	catch(err) {
		deferred.reject(err);
	}

	
	return deferred.promise;
}



module.exports = UPVSakaiRoleProvider;
