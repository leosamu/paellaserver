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
var passport = require('passport');
var security = require('./security');


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
app.use(passport.initialize());
app.use(passport.session());

security.init(app);

var router = express.Router();

mongoose.connect(configure.config.db.url, function(err, res) {
	if (err) throw err;
	console.log("Conected to polimedia");
	configure.checkInitConfig();
	repository.setup(router,app);
});


var RESTFilesystem = require(__dirname + '/rest-resources');
var ClientResources = require(__dirname + '/client-resources');

var restRoot = __dirname + '/rest';
var pluginRoot = __dirname + '/plugins';
RESTFilesystem.routeDirectory(router,restRoot);
RESTFilesystem.routePlugins(router,pluginRoot);

var clientCode = ClientResources.getClientJavascript('plugins');
router.get('/client.js', function(req,res) {
	res.setHeader("content-type","text/javascript");
	res.send(clientCode);
});

ClientResources.buffer = "";
var clientCSS = ClientResources.getClientStylesheet('plugins');
router.get('/client.css', function(req,res) {
	res.setHeader("content-type","text/css");
	res.send(clientCSS);
});

var clientIndex = ClientResources.getClientHtml(__dirname + '/client/index.html');
router.get(['/index.html','/'], function(req,res) {
	res.setHeader("content-type","text/html");
	res.send(clientIndex);
});

app.use(router);

app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/plugins',{extensions: ['htm','html']}));

router.get(['/player/index.html','/player/'],function(req,res) {
	fs.readFile('./client/player/index.html', 'utf8', function (err,data) {
		if (err) {
		 	console.log(err);
			res.status(500).send('Internal error: missing player files').end();
		}
		else {
			var appendHeader = '<script src="/player.js"></script></head>';
			data = data.replace('</head>',appendHeader);
			res.type('text/html').send(data).end();
		}
	});
});

router.get(['/player/config/config.json'],function(req,res) {
	var playerConfig = require('./client/player/config/config.json');
	playerConfig.experimental = playerConfig.experimental || {};
	playerConfig.experimental.autoplay = true;

	playerConfig.auth = playerConfig.auth || {};
	playerConfig.auth.authCallbackName = "paellaserver.authCallback";
	playerConfig.auth.userDataCallbackName = "paellaserver.loadUserDataCallback";

	res.json(playerConfig);
});

app.listen(configure.config.connection.port, function() {
	console.log("Node server running on http://localhost:" + configure.config.connection.port);
});

