var fs = require('fs');

module.exports = {
	buffer:"",

	getClientHtml:function(path) {
		var indexPage = path;
		var buffer = fs.readFileSync(indexPage,'utf8');
		var configPath = __dirname + '/plugins/app/app.json';
		var appConfig = require(configPath);
		if (buffer && appConfig && appConfig.appName) {
			var appName = appConfig.appName;
			buffer = buffer.replace('<html>','<html ng-app="' + appName + '">');
			buffer = buffer.replace('</head>','\t<script src="client.js"></script>\n\t\t<link rel="stylesheet" href="client.css">\n\t</head>');
		}
		return buffer;
	},

 	getClientJavascript:function(path) {
	 	this.getJavascriptCode(path + '/app/client',this.buffer);
		this.searchClientJavascript(path,"");
		return this.buffer;
	},

	getClientStylesheet:function(path) {
		this.searchClientStylesheet(path,"");
		return this.buffer;
	},

	searchClientJavascript:function(path) {
		if (!fs.existsSync(path)) return;
		var dir = fs.readdirSync(path);
		var This = this;
		dir.forEach(function(entry) {
			if (entry!='app') {
				var itemPath = path + "/" + entry;
				var stats = fs.lstatSync(itemPath);
				if (stats.isDirectory() && entry=="client") {
					This.getJavascriptCode(itemPath);
				}
				else if (stats.isDirectory()) {
					This.searchClientJavascript(itemPath);
				}
			}
		});
	},

	searchClientStylesheet:function(path) {
		if (!fs.existsSync(path)) return;
		var dir = fs.readdirSync(path);
		var This = this;
		dir.forEach(function(entry) {
			var itemPath = path + "/" + entry;
			var stats = fs.lstatSync(itemPath);
			if (stats.isDirectory() && entry=="client") {
				This.getStylesheetCode(itemPath);
			}
			else if (stats.isDirectory()) {
				This.searchClientStylesheet(itemPath);
			}
		});
	},

	getJavascriptCode:function(path,buffer) {
		if (!fs.existsSync(path)) return;
		var dir = fs.readdirSync(path);
		var This = this;
		dir.forEach(function(entry) {
			var itemPath = path + "/" + entry;
			var stats = fs.lstatSync(itemPath);
			if (stats.isDirectory()) {
				This.getJavascriptCode(itemPath,buffer);
			}
			else if (entry.split('.').pop()=='js') {
				This.buffer += "\n\n/* " + itemPath + " */\n";
				This.buffer += fs.readFileSync(itemPath);
			}
		});
	},

	getStylesheetCode:function(path,buffer) {
		if (!fs.existsSync(path)) return;
		var dir = fs.readdirSync(path);
		var This = this;
		dir.forEach(function(entry) {
			var itemPath = path + "/" + entry;
			var stats = fs.lstatSync(itemPath);
			if (stats.isDirectory()) {
				This.getJavascriptCode(itemPath,buffer);
			}
			else if (entry.split('.').pop()=='css') {
				This.buffer += "\n\n/* " + itemPath + " */\n";
				This.buffer += fs.readFileSync(itemPath);
			}
		});
	}
}