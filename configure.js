var mongoose = require('mongoose');
var configFile = require("./config");
var Q = require('q');
var Config = require("./models/config");


function serverUrl() {	
	var port = exports.config.connection.port;
	var showPort = exports.config.connection.showPortInURL;
	return exports.config.connection.protocol + '://' +
		exports.config.connection.rootUrl +
		(showPort && port!=80 && port!=443 ? ':' + port : "");
};


function loadConfig (callback) {
	exports.config = {};		
	Config.find({}, function(err, data) {
		if (err) { throw err;}
		
		data.forEach(function(c) {
			exports.config[c._id] = c.value;
		});
		callback();
	});		
};



exports.config = {};
exports.configFile = configFile;
exports.serverUrl = serverUrl;
//exports.checkInitConfig = checkInitConfig;
exports.loadConfig = loadConfig;
//exports.saveConfig = saveConfig;
