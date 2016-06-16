var TranslecturesModel = require('../models/translectures.js');
var Q = require('q');

exports.getTlAPI = function(tlInfo) {
	var deferred = Q.defer();
	
	if (tlInfo.server) {
		TranslecturesModel.findOne({_id: tlInfo.server}, function(err, server) {
			var api = require('../API/' + server.apiVersion);
			deferred.resolve( new api(server.server, server.user, server.password) );			
		})					
	}
	else {
		deferred.reject();		
	}	
	
	return deferred.promise;
}