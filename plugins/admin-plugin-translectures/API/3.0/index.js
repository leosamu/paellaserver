var Video = require('./../../../../models/video');

var request = require('request');
var Q = require('q');
var crypto = require('crypto');


/**
 * `TranslecturesAPI30` constructor.
 */
function TranslecturesAPI30(server) {
	this._server = server;
} 


TranslecturesAPI30.prototype.langs = function(videoId) {
	var deferred = Q.defer();

	request.get(this._server.server + '/speech/langs?id=' + videoId + "&user=" + this._server.user + "&auth_token=" + this._server.password,
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

TranslecturesAPI30.prototype.dfxp = function(videoId, lang) {
	var deferred = Q.defer();
	
	request.get(this._server.server + '/speech/get?id=' + videoId + "&lang=" + lang + "&format=1&user=" + this._server.user + "&auth_token=" + this._server.password,	
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
	
	request.get(this._server.server + '/speech/status?id=' + uploadId + "&user=" + this._server.user + "&auth_token=" + this._server.password,	
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

TranslecturesAPI30.prototype.getURLToEditor = function(user, video, lang) {
	var deferred = Q.defer();
	
	var userId = "anonymous";
	var userName = "Anonymous";
	var tlConf = 0;
	if (user) {
		userId = user._id;
		userName = user.contactData.lastName + ", " + user.contactData.name;
		var isOwner = false;
		var isRevisor = false;
		try {
			isOwner = video.owner.some(function(o){ return (o == userId); });
			isRevisor = user.roles.some(function(r){ return (r._id == "TRANSLECTURES_REVISOR"); })
		}
		catch(e){}
		
		if (isOwner || isRevisor) {
			tlConf = 100;
		}
		else {
			tlConf = 50;
		}
	}
	
	var expire = new Date();
	expire.setDate(expire.getDate()+60);
		
	var requestStr1 = video._id + expire.getTime() + this._server.user + this._server.password;	
	var shasum1 = crypto.createHash('sha1');
	shasum1.update(requestStr1);
	var requestKey1 = shasum1.digest('hex');	

	var requestStr2 = userId + tlConf.toString() + expire.getTime().toString() + this._server.user + this._server.password;	
	var shasum2 = crypto.createHash('sha1');
	shasum2.update(requestStr2);
	var requestKey2 = shasum2.digest('hex');	
	
	var requestKey = requestKey1 + requestKey2;
	
	
	var json =  {
		"id" : video._id,
		"lang" : lang,
		"author_id" : userId,
		"author_conf" : tlConf,
		"author_name" : userName,
		"expire" : expire.getTime(),
		"api_user" : this._server.user,
		"request_key" : requestKey
	};	
	
	var jsonSTR = JSON.stringify(json);
	var jsonBuffer = new Buffer(jsonSTR);
	var json64 = jsonBuffer.toString('base64');	

	var redirectEditor = this._server.playerURL + "?request="+encodeURIComponent(json64);
	deferred.resolve(redirectEditor);

	return deferred.promise;
}

TranslecturesAPI30.prototype.getURLToPlayer = function(user, video, lang) {
	var deferred = Q.defer();
	
	var userId = "anonymous";
	var userName = "Anonymous";
	var tlConf = 0;
	if (user) {
		userId = user._id;
		userName = user.contactData.lastName + ", " + user.contactData.name;
		var isOwner = false;
		var isRevisor = false;
		try {
			isOwner = video.owner.some(function(o){ return (o == userId); });
			isRevisor = user.roles.some(function(r){ return (r._id == "TRANSLECTURES_REVISOR"); })
		}
		catch(e){}
		
		if (isOwner || isRevisor) {
			tlConf = 100;
		}
		else {
			tlConf = 50;
		}
	}
	
	var expire = new Date();
	expire.setDate(expire.getDate()+10);
		
	var requestStr = video._id + expire.getTime() + this._server.user + this._server.password;	
	var shasum = crypto.createHash('sha1');
	shasum.update(requestStr);
	var requestKey = shasum.digest('hex');	
	
	var json =  {
		"id" : video._id,
		"lang" : lang,
		"author_id" : userId,
		"author_conf" : tlConf,
		"author_name" : userName,
		"expire" : expire.getTime(),
		"api_user" : this._server.user,
		"request_key" : requestKey
	};
	
	var jsonSTR = JSON.stringify(json);
	var jsonBuffer = new Buffer(jsonSTR);
	var json64 = jsonBuffer.toString('base64');	


	var redirectPlayer = this._server.playerURL + "?request="+encodeURIComponent(json64);
	deferred.resolve(redirectPlayer);	

	return deferred.promise;
}




module.exports = TranslecturesAPI30;






