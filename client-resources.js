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
			var debug = typeof v8debug === 'object';
			buffer = buffer.replace('<html>','<html ng-app="' + appName + '">');
			buffer = buffer.replace('</head>','\t<script src="client.js"></script>\n\t\t<link rel="stylesheet" href="client.css">\n\t</head>');
			if (debug) {
				buffer = buffer.replace('angular.min.js','angular.js');
			}
		}
		return buffer;
	},


 	getClientI18n:function(path, lang) {
		var i18n = {};
		
		if (fs.existsSync(path)){
			var dir = fs.readdirSync(path);
			dir.forEach(function(pluginName) {				
				if (fs.existsSync(path+'/'+pluginName+'/i18n' )){
					var filepath = path+'/'+pluginName+'/i18n/'+lang+'.json'
					if (fs.existsSync(filepath)) {
						var data = fs.readFileSync(filepath);
						try {												
							var merge = function() {
							    var obj = {},
							        i = 0,
							        il = arguments.length,
							        key;
							    for (; i < il; i++) {
							        for (key in arguments[i]) {
							            if (arguments[i].hasOwnProperty(key)) {
							                obj[key] = arguments[i][key];
							            }
							        }
							    }
							    return obj;
							};						
						
							var jdata = JSON.parse(data);
							i18n = merge(i18n, jdata);
							
						}
						catch(e){}
					};
				}
			});
		}		
		return i18n;
	},



 	getClientJavascript:function(path) {
	 	this.getJavascriptCode(path + '/app/client',this.buffer);
		this.searchClientJavascript(path);
		return this.buffer;
	},

	getEditorJavascript:function(path) {
		this.getJavascriptCode(path + '/app/editor',this.buffer);
		this.searchClientJavascript(path,'editor');
		return this.buffer;
	},

	getClientStylesheet:function(path) {
		this.searchClientStylesheet(path,"");
		return this.buffer;
	},

	getPlayerJavascript:function(path) {
		this.buffer = "";
		this.searchClientJavascript(path,"player");
		return this.buffer;
	},

	searchClientJavascript:function(path,codeFolder) {
		codeFolder = codeFolder || 'client';
		if (!fs.existsSync(path)) return;
		var dir = fs.readdirSync(path);
		var This = this;
		dir.forEach(function(entry) {
			if (entry!='app') {
				var itemPath = path + "/" + entry;
				var stats = fs.lstatSync(itemPath);
				if (stats.isDirectory() && entry==codeFolder) {
					This.getJavascriptCode(itemPath);
				}
				else if (stats.isDirectory()) {
					This.searchClientJavascript(itemPath,codeFolder);
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