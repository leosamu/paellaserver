var Video = require('./../../../../models/video');

var request = require('request');
var Q = require('q');



/**
 * `TranslecturesAPI10` constructor.
 */
function TranslecturesAPI10(server, user, pass) {
	this._server = server;
	this._user = user;
	this.pass = pass;
} 


TranslecturesAPI10.prototype.langs = function(videoId) {
	var deferred = Q.defer();
	
	request.post(this._server + '/langs?db=' + this._user + '&id=' + videoId,
		function(error, response, body) {
			if (error) {
				deferred.reject();
			}
			else if (response.statusCode>=400) {
				deferred.reject();
			}
			else {
				var jbody = JSON.parse(body);
				var langs = [];
				if (jbody.scode == 0) {
					jbody.langs.forEach(function(l){
						var status;
						if (l.type == 0) { status = 'automatic'; }
						if (l.type == 1) { status = 'manual'; }
						langs.push({
							lang: l.code,
							label: l.value,
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

TranslecturesAPI10.prototype.dfxp = function(videoId, lang ) {
	var deferred = Q.defer();
	
	request.post(this._server + '/dfxp?db=' + this._user + '&format=1&pol=0&id=' + videoId + '&lang=' + lang,
		function(error, response, body) {
			if (error) {
				deferred.reject();
			}
			else if (response.statusCode>=400) {
				deferred.reject();
			}
			else {
				deferred.resolve(body);
			}
		}
	);
					
	return deferred.promise;		
}		


TranslecturesAPI10.prototype.status = function(videoId) {
	var deferred = Q.defer();
	var uploadId = videoId;
	
	request.post(this._server + '/status?db=' + this._user + '&id=' + uploadId,
		function(error, response, body) {
			if (error) {
				deferred.reject();
			}
			else if (response.statusCode>=400) {
				deferred.reject();
			}
			else {
				var jbody = JSON.parse(body);
				if (jbody.scode == 1) {
					deferred.resolve({});
				}
				else {
					deferred.resolve(body);
				}
			}
		}
	);
					
	return deferred.promise;		
}

TranslecturesAPI10.prototype.getURLToEditor= function(videoId) {
		
}




module.exports = TranslecturesAPI10;






