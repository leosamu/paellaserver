var Video = require('./../../../../models/video');

var request = require('request');
var Q = require('q');



/**
 * `TranslecturesAPI30` constructor.
 */
function TranslecturesAPI30(server, user, passwd) {
	this._server = server;
	this._user = user;
	this._passwd = passwd;
} 


TranslecturesAPI30.prototype.langs = function(videoId) {
	var deferred = Q.defer();

	videoId = "test-en-1";				

	request.get(this._server + '/speech/langs?id=' + videoId + "&user=" + this._user + "&auth_token=" + this._passwd,
		function(error, response, body) {
			if (error) {
				deferred.reject();
			}
			else if (response.statusCode>=400) {
				deferred.reject();
			}
			else {
				var langs = [];
				var jbody = JSON.parse(body);
				if (jbody.rcode == 0) {
					jbody.langs.forEach(function(l){
						var status;
						if (l.sup_status == 0) { status = 'automatic'; }
						if (l.sup_status == 1) { status = 'partially'; }
						if (l.sup_status == 2) { status = 'manual'; }
						langs.push({
							lang: l.lang_code,
							label: l.lang_name,
							transcription: status
						});
					});
				}
				deferred.resolve(langs);
			}
		}
	);
					
	return deferred.promise;
}

TranslecturesAPI30.prototype.dfxp = function(videoId, lang ) {
	var deferred = Q.defer();
	
	request.get(this._server + '/speech/get?id=' + uploadId + "&lang=" + lang + "&format=1&user=" + this._user + "&auth_token=" + this._passwd,	
		function(error, response, body) {
			if (error) {
				deferred.reject(500);
			}
			else if (response.statusCode>=400) {
				deferred.reject(500);
			}
			else {
				deferred.resolve(body);
			}
		}
	);
					
	return deferred.promise;		
}		


TranslecturesAPI30.prototype.status = function(uploadId) {
	var deferred = Q.defer();
	
	console.log("88");
	request.get(this._server + '/speech/status?id=' + uploadId + "&user=" + this._user + "&auth_token=" + this._passwd,	
		function(error, response, body) {
			if (error) {
				deferred.reject(500);
			}
			else if (response.statusCode>=400) {
				deferred.reject(500);
			}
			else {
				var jbody = JSON.parse(body);
				if (jbody.rcode == 1) {
					deferred.reject(404);
				}
				else {
					var ret = {
						status: 'unknown',
						description: jbody.status_info
					};
					if (jbody.status_code == 0) {
						ret.status = "queued";
					}
					else if (jbody.status_code < 6) {
						ret.status = "pocesing";
					}
					else if (jbody.status_code == 6) {
						ret.status = "pocessed";
					}
					else if (jbody.status_code < 100) {
						ret.status = "unknown";
					}
					else {
						ret.status = "error";
					}
					deferred.resolve(ret);
				}
			}
		}
	);
					
	return deferred.promise;		
}

TranslecturesAPI30.prototype.getURLToEditor= function(videoId) {
		
}




module.exports = TranslecturesAPI30;






