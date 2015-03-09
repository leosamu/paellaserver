var express = require("express");
var session = require("express-session");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var fs = require("fs");
var mongoose = require("mongoose");
var configure = require("./configure");
var repository = require("./repository");
var cookieParser = require("cookie-parser");

var db = mongoose.connection;
db.once('open', function(callback) {});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
	secret:configure.config.session.secret,
	resave: true,
	saveUninitialized: true
}));

mongoose.connect(configure.config.db.url, function(err, res) {
	if (err) throw err;
	console.log("Conected to polimedia");
	configure.checkInitConfig();
	repository.setup(router,app);
});

var router = express.Router();
var RESTFilesystem = require(__dirname + '/rest-resources');
var ClientResources = require(__dirname + '/client-resources');

var restRoot = __dirname + '/rest';
var pluginRoot = __dirname + '/plugins';
RESTFilesystem.routeDirectory(router,restRoot);
RESTFilesystem.routePlugins(router,pluginRoot);

var clientCode = ClientResources.getClientJavascript('plugins');
router.get('/client.js', function(req,res) {
	res.send(clientCode);
});

var clientCSS = ClientResources.getClientStylesheet('plugins');
router.get('/client.css', function(req,res) {
	res.send(clientCSS);
});

var clientIndex = ClientResources.getClientHtml(__dirname + '/client/index.html');
router.get(['/index.html','/'], function(req,res) {
	res.send(clientIndex);
});

app.use(router);

app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/plugins',{extensions: ['htm','html']}));

app.listen(configure.config.connection.port, function() {
	console.log("Node server running on http://localhost:" + configure.config.connection.port);
});
