var fs = require('fs');
var configure = require(__dirname + '/configure');
var multer = require('multer');

module.exports = {
	routeFile: function(router,path,endpointBase) {
		if (endpointBase===undefined) {
			endpointBase = path.replace(__dirname, "");
			router.get(endpointBase, function(req,res) {
				res.status(403).send("Forbidden");
			});
			endpointBase = endpointBase.replace(".js","");
		}
		else {
			var filePath = path.replace(__dirname + '/plugins', "");
			// Prevent publish javascript file
       		router.get(filePath, function(req,res) {
				res.status(403).send("Forbidden");
			});
		}
		var routes = require(path).routes;
		if (routes) {
			for (var key in routes) {
            	var route = routes[key];
            	var method = null;
            	var callback = null;
            	var param = route.param;
				var upload = route.upload;
				var extension = route.extension;
            	for (method in route) {
            		var value = route[method];
            		if (method!='upload' && (typeof(value)=="function" || typeof(value)=="object")) {
            			callback = value;
            			break;
            		}
            	}
				var endpoint = endpointBase;
				if (extension) {
					endpoint += '.' + extension;
				}
				if (param) {
					endpoint += '/:' + param;
				}


				endpoint = endpoint.replace(/[\-_]{1}/, ':');
				console.log(endpoint + " > " + method);
				if (upload) {
					router[method](endpoint, multer({ dest:__dirname + "/uploads" }).single(upload), callback);
				}
				else {
					router[method](endpoint, callback);
				}
            }
		}
		else {
			console.log("Warning (" + endpointBase + "): No routes found");
		}
	},

	routeDirectory: function(router,path,pluginName) {
		var dirName = path.split('/').pop();
		if (!fs.existsSync(path)) return;
		var dir = fs.readdirSync(path);
		var This = this;
        dir.forEach(function(entry) {
			var itemPath = path + "/" + entry;
        	var stats = fs.lstatSync(itemPath);
        	if (stats.isDirectory()) {
        		This.routeDirectory(router,itemPath);
        	}
        	else {
				var re = /plugins\/(\w+)\/rest(\/.*)*$/i;
        		if (re.test(path)) {
					var reData = re.exec(path);
					var pluginName = reData[1];
					var pluginSubpath = reData[2] ? reData[2] + "/" : "/";
        			var pluginEndpoint = configure.config && configure.config.plugins ? configure.config.plugins.endpoint:'/rest/plugins/';
        			endpoint = pluginEndpoint + pluginName + pluginSubpath + entry.split('.')[0];
        			This.routeFile(router,itemPath,endpoint);
        		}
        		else {
        			This.routeFile(router,itemPath);
        		}
        	}
        });
	},

	routePlugins:function(router,pluginsPath) {
		if (!fs.existsSync(pluginsPath)) return;
		var pluginDir = fs.readdirSync(pluginsPath);
		var This = this;
		pluginDir.forEach(function(entry) {
			var pluginPath = pluginsPath + "/" + entry + "/rest";
			if (fs.existsSync(pluginPath)) {
				var stats = fs.lstatSync(pluginPath);
				if (stats.isDirectory()) {
					This.routeDirectory(router,pluginPath,entry);
				}
			}
		});
	}
}
