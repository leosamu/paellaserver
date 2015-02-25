var fs = require('fs');

module.exports = {
	buffer:"",

 	getClientJavascript:function(path) {
 		this.buffer = "";
		this.searchClientJavascript(path,"");
		return this.buffer;
	},

	getClientStylesheet:function(path) {
		this.buffer = "";
		this.searchClientStylesheet(path,"");
		return this.buffer;
	},

	searchClientJavascript:function(path) {
		if (!fs.existsSync(path)) return;
		var dir = fs.readdirSync(path);
		var This = this;
		dir.forEach(function(entry) {
			var itemPath = path + "/" + entry;
			var stats = fs.lstatSync(itemPath);
			if (stats.isDirectory() && entry=="client") {
				This.getJavascriptCode(itemPath);
			}
			else if (stats.isDirectory()) {
				This.searchClientJavascript(itemPath);
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