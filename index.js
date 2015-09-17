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
var MongoStore = require('connect-mongo')(session);

var db = mongoose.connection;
db.once('open', function(callback) {});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
	secret:configure.config.session.secret,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({ mongooseConnection: db })
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

var playerCode = ClientResources.getPlayerJavascript('plugins');
router.get('/player/plugins.js', function(req,res) {
	res.setHeader("content-type","text/javascript");
	res.send(playerCode);
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

var clientEmbed = ClientResources.getClientHtml(__dirname + '/client/embed.html');
router.get(['/embed.html','/'], function(req,res) {
	res.setHeader("content-type","text/html");
	res.send(clientEmbed);
});

app.use(router);

app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/plugins',{extensions: ['htm','html']}));

function getPlayerIndex(req,res) {
	fs.readFile('./client/player/index.html', 'utf8', function (err,data) {
		if (err) {
			console.log(err);
			res.status(500).send('Internal error: missing player files').end();
		}
		else {
			var appendHeader = '<script src="/player/plugins.js"></script></head>';
			var resourcesPath = "url:'../rest/paella'";
			var paellaTitle = '<title>Paella Engage Example</title>';
			var playerTitle = configure.config.player && configure.config.player.title;
			var serverTitle = '<title>' + playerTitle + '</title>';
			data = data.replace('</head>',appendHeader);
			data = data.replace("url:'../repository/'", resourcesPath);
			data = data.replace(paellaTitle, serverTitle);
			res.type('text/html').send(data).end();
		}
	});
}

router.get(['/player/index.html','/player/','/player/embed.html'], getPlayerIndex);

router.get(['/player/config/config.json'],function(req,res) {
	var playerConfig = require('./client/player/config/config.json');
	playerConfig.experimental = playerConfig.experimental || {};
	playerConfig.experimental.autoplay = true;

	playerConfig.auth = playerConfig.auth || {};
	playerConfig.auth.authCallbackName = "paellaserver_authCallback";
	playerConfig.auth.userDataCallbackName = "paellaserver_loadUserDataCallback";
	playerConfig.plugins.enablePluginsByDefault = true;
	playerConfig.plugins.list["es.upv.paella.extendedTabAdapterPlugin"] = { enabled:false };
	playerConfig.plugins.list["es.upv.paella.multipleQualitiesPlugin"] = { enabled:true, showWidthRes: true };
	
	playerConfig.plugins.list["es.upv.paella.translecture.captionsPlugin"] = {
		 "enabled": true,
		 "tLServer": "https://fuster.cc.upv.es/tl-pm",
		 "tLdb": "pm",
		 "tLEdit": "/rest/plugins/translectures/redirectToEditor/${videoId}?lang=${tl.lang.code}"
	 };

	res.json(playerConfig);
});

app.listen(configure.config.connection.port, function() {
	console.log("Node server running on http://localhost:" + configure.config.connection.port);
});

