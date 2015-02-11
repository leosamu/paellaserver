var express = require("express");
var session = require("express-session");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var fs = require("fs");
var mongoose = require("mongoose");
var configure = require("./configure");
var repository = require("./repository");

var db = mongoose.connection;
	db.once('open', function(callback) {
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret:configure.config.session.secret}));

mongoose.connect(configure.config.db.url, function(err, res) {
	if (err) throw err;
	console.log("Conected to polimedia");
	configure.checkInitConfig();
	repository.setup(router,app);
});

var router = express.Router();

router.get('/', function(req, res) {
	res.send("Hello, World!");
});

var RESTFilesystem = {
	routeFile: function(path) {
		var endpointBase = path.replace(__dirname, "");
		endpointBase = endpointBase.replace(".js","");
		var routes = require(path).routes;
		if (routes) {
			for (var key in routes) {
            	var route = routes[key];
            	var method = null;
            	var callback = null;
            	var param = route.param;
            	for (method in route) {
            		var value = route[method];
            		if (typeof(value)=="function" || typeof(value)=="object") {
            			callback = value;
            			break;
            		}
            	}
				var endpoint = endpointBase;
				if (param) {
					endpoint += '/:' + param;
				}

            	console.log(endpoint + " > " + method);
            	router[method](endpoint,callback);
            }
		}
		else {
			console.log("Warning (" + endpointBase + "): No routes found");
		}
	},

	routeDirectory: function(path) {
		var dir = fs.readdirSync(path);
		var This = this;
        dir.forEach(function(entry) {
        	var itemPath = path + "/" + entry;
        	var stats = fs.lstatSync(itemPath);
        	if (stats.isDirectory()) {
        		This.routeDirectory(itemPath);
        	}
        	else {
        		This.routeFile(itemPath);
        	}
        });
	}
}

var restRoot = __dirname + '/rest';
RESTFilesystem.routeDirectory(restRoot);

app.use(express.static(__dirname + '/client'));

app.use(router);

app.listen(configure.config.connection.port, function() {
	console.log("Node server running on http://localhost:" + configure.config.connection.port);
});
