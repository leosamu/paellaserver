var Video = require('./../../../../models/video');

var request = require('request');
var Q = require('q');
var crypto = require('crypto');


/**
 * `TranslecturesAPI10` constructor.
 */
function TranslecturesAPI10(server) {
	this._server = server;
} 


TranslecturesAPI10.prototype.langs = function(videoId) {
	var deferred = Q.defer();
	
	request.post(this._server.server + '/langs?db=' + this._server.user + '&id=' + videoId,
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
	
	request.post(this._server.server + '/dfxp?db=' + this._server.user + '&format=1&pol=0&id=' + videoId + '&lang=' + lang,
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
		
	request.post(this._server.server + '/status?db=' + this._server.user + '&id=' + uploadId,
		function(error, response, body) {
			if (error) {
				deferred.reject(500);
			}
			else if (response.statusCode>=400) {
				deferred.reject(500);
			}
			else {
				var jbody = JSON.parse(body);
				
				var ret = {
					status: 'unknown',
					description: jbody.desc + " (" + jbody.info + ")"
				};				
				
				if (jbody.scode == 1) {
					ret.status = 'error';
				}
				
				deferred.resolve(ret);
			}
		}
	);
					
	return deferred.promise;		
}

TranslecturesAPI10.prototype.getURLToEditor = function(user, video, lang) {
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
	var json = {
		tlid: video._id,
		tldb: this._server.user,
		tlbaseurl: this._server.editorURL + "/data/pm/data",
		tllang: lang,
		tluserid: userId,
		tlusername: userName,
		tlconf: tlConf,
		tlexpire: expire.getTime()
	};
	var jsonSTR = JSON.stringify(json);
	var jsonBuffer = new Buffer(jsonSTR);
	var json64 = jsonBuffer.toString('base64');
	
	var shasum = crypto.createHash('sha1');
	var passjson64 = this._server.password + json64;
	shasum.update(passjson64);
	jsonSHA1 = shasum.digest('hex');						
	

	var redirectEditor = this._server.editorURL + "?tldata="+encodeURIComponent(json64)+"&tlkey="+encodeURIComponent(jsonSHA1);

	deferred.resolve(redirectEditor);
	
	return deferred.promise;		
}




module.exports = TranslecturesAPI10;






