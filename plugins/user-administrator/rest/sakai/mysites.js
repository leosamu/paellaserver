/*
	404 - Not Found
	204 - Updated
	201 - Created
	200 - Response
	400 - Bad Request
	403 - Forbiden
	401 - Unauthorized
	500 - Internal Server Error
*/
/*
var Video = require(__dirname + '/../../../models/video');
var Catalog = require(__dirname + '/../../../models/catalog');
var CatalogController = require(__dirname + '/../../../controllers/catalog');
*/

var configure = require("../../../../configure.js");
var AuthController = require('../../../../controllers/auth');

var util = require('util');
var Q = require('q');
var request = require('request');
var iconv = require('iconv-lite');



exports.routes = {
	mySites: { 
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req,res) {
				try {
					var callUser = configure.config.security.UPV.piolin.rest.asignaturas.user;
					var callPass = configure.config.security.UPV.piolin.rest.asignaturas.password;
				
					request.post('https://' + callUser + ':' + callPass + '@piolin.upv.es/consultas/?c=asignaturas',
						{
							form:{ correo: "miesgre@upv.es" },
							encoding:null,
							headers:{
								'Content-type': "application/x-www-form-urlencoded; charset=ISO-8859-1"
							}
						},
						function(error, response, body) {
						
							if (error) {
								console.log(error);
								return res.sendStatus(500);
							}
							else if (response.statusCode>=400) {
//								deferred.reject(new Error("Error " + response.statusCode));
								console.log(error);
								return res.sendStatus(500);
							}
							else {								
								var sites = [];
								body = iconv.decode(body,'iso-8859-1');
								jbody = JSON.parse(body);
								

								jbody.forEach(function(s) {								
									sites.push({
										sakai: s.cod_poliformat,
										description: s.asignatura,
										role: s.rol
									});					
								});
								
								console.log(sites);
								res.send(sites);
							}
						}
					);
				}
				catch(err) {
					return res.sendStatus(500);
				}											
			}
		]
	}
}

