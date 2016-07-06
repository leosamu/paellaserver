
var request = require('request');
var https = require('https');
var querystring = require('querystring');
var Q = require("q");
var iconv = require('iconv-lite');

var Utils = {
	userByEmail:function(email) {
		var deferred = Q.defer();

		var user = "mulmedia";
		var pass = "2DatosD1Person(a)";

		request.post('https://' + user + ':' + pass + '@piolin.upv.es/consultas/?c=deEmail',
			{
				form:{ email:email },
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
//						var iconv = new Iconv('latin1','utf-8');
					body = iconv.decode(body,'iso-8859-1');
					deferred.resolve(body);
				}
			});
		return deferred.promise;
	}
};

exports.Utils = Utils;

// Search an user by email in the UPV database, using the Piolin REST API
//	input: req.params.search
//	output: req.data: the user data
exports.UserByEmail = function(req,res,next) {

	Utils.userByEmail(req.params.search)
			.then(function(data) {
				req.data = data;
				try {
					req.data = JSON.parse(req.data);
					if (Object.keys(req.data).length==0) {
						req.data = null;
					}
				}
				catch (e) {}
				next();
			})
			.fail(function(err) {
				req.data = null;
				next();
			});
};

