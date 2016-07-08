var mongoose = require("mongoose");
var configure = require("./configure");

var db = mongoose.connection;
db.once('open', function(callback) {});

function startServer() {
	var express = require("express");
	var session = require("express-session");
	var app = express();
	var bodyParser = require("body-parser");
	var methodOverride = require("method-override");
	var fs = require("fs");
	var repository = require("./repository");
	var cookieParser = require("cookie-parser");
	var passport = require('passport');
	var security = require('./security');
	var MongoStore = require('connect-mongo')(session);
	var traceurApi = require('traceur/src/node/api.js');
	var plugins = require('./plugins.js');
	plugins.loadPlugins();
	

	app.use(bodyParser.urlencoded({ extended: true, limit:'500mb' }));
	app.use(bodyParser.json({ limit: '500mb' }));
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
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});

	app.use(function(req,res,next){
		if (req.headers['x-requested-auth'] == 'Digest') {
			passport.authenticate('digest', { session: false })(req, res, next);
		}
		else {
			next();
		}
	});

	security.init(app);

	var router = express.Router();
	repository.setup(router,app);

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

	router.get('/playerDev/plugins.js', function(req,res) {
		res.setHeader("content-type","text/javascript");
		res.send(playerCode);
	});

	ClientResources.buffer = "";
	var clientCSS = ClientResources.getClientStylesheet('plugins');
	router.get('/client.css', function(req,res) {
		res.setHeader("content-type","text/css");
		res.send(clientCSS);
	});

	router.get('/i18n/:lang.json', function(req,res) {
		res.send(ClientResources.getClientI18n('plugins', req.params.lang));
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

	var playerDeps = ClientResources.processPluginDependencies(router,'playerDeps','playerDeps');
	function getPlayerIndex(playerIndexPath) {
		return function(req,res) {
			fs.readFile('./client/' + playerIndexPath + 'index.html', 'utf8', function (err, data) {
				if (err) {
					console.log(err);
					res.status(500).send('Internal error: missing player files').end();
				}
				else {
					var appendHeader = "";
					playerDeps.forEach(function(depPath) {
						var ext = depPath.split('.').pop();
						if (ext=='js') {
							appendHeader += '<script src="' + depPath + '"></script>';	
						}
						else if (ext=='css') {
							appendHeader += '<link rel="stylesheet" type="text/css" href="' + depPath + '">';
						}
					})

					appendHeader += '<script src="/' + playerIndexPath + 'plugins.js"></script></head>';
					//		var resourcesPath = "url:'../rest/paella'";
					var paellaTitle = '<title>Paella Engage Example</title>';
					var playerTitle = configure.config.player && configure.config.player.title;
					var serverTitle = '<title>' + playerTitle + '</title>';

					var onLoad = "loadPlayer();";	// see plugins/login/player/load_callback.js
					data = data.replace('</head>', appendHeader);
					//		data = data.replace("url:'../repository/'", resourcesPath);
					data = data.replace("paella.load('playerContainer',{ url:'../repository/' });", onLoad);
					data = data.replace(paellaTitle, serverTitle);
					res.type('text/html').send(data).end();
				}
			});
		}
	}

	var editorDeps = ClientResources.processPluginDependencies(router,'editorDeps','editorDeps');
	var editorDict = ClientResources.processDictionaries(router,'editor/localization','editorDictionary');
	function getEditorIndex(playerIndexPath) {
		return function(req,res) {
			fs.readFile('./client/' + playerIndexPath + 'editor.html', 'utf8', function (err, data) {
				if (err) {
					console.log(err);
					res.status(500).send('Internal error: missing player files').end();
				}
				else {
					var appendHeader = "";
					editorDeps.forEach(function(depPath) {
						var ext = depPath.split('.').pop(); 
						if (ext=='js') {
							appendHeader += '<script src="' + depPath + '"></script>';	
						}
						else if (ext=='css') {
							appendHeader += '<link rel="stylesheet" type="text/css" href="' + depPath + '">';
						}
						
					});
					appendHeader += '<script src="/' + playerIndexPath + 'plugins.js"></script>\n' +
									'<script src="/' + playerIndexPath + 'editor-plugins.js"></script>\n';
									
					appendHeader += '<script>';
					appendHeader += '	(function() {' +
									'var lang=base.dictionary.currentLanguage();' + 
									'var dict=' + JSON.stringify(editorDict) + ';dict=dict[lang];' +
									'if(dict)base.dictionary.addDictionary(dict);' +
									'})();';
					appendHeader += '</script>';
					appendHeader += '</head>';
					//		var resourcesPath = "url:'../rest/paella'";
					var paellaTitle = '<title>Paella Engage Example</title>';
					var playerTitle = configure.config.player && configure.config.player.title;
					var serverTitle = '<title>' + playerTitle + '</title>';

					var onLoad = "loadPlayer();";	// see plugins/login/player/load_callback.js
					data = data.replace('</head>', appendHeader);
					//		data = data.replace("url:'../repository/'", resourcesPath);
					data = data.replace("paella.load('playerContainer',{ url:'../repository/' });", onLoad);
					data = data.replace(paellaTitle, serverTitle);
					res.type('text/html').send(data).end();
				}
			});
		}
	}

	function getPlayerConfig(playerIndexPath) {
		return function(req,res) {
			var playerConfig = require('./client/' + playerIndexPath + 'config/config.json');
			playerConfig.experimental = playerConfig.experimental || {};
			playerConfig.experimental.autoplay = true;

			playerConfig.editor = {enabled: false};
			playerConfig.player = playerConfig.player || {};
			playerConfig.player.accessControlClass = "PaellaServerAccessControl";

			playerConfig.auth = playerConfig.auth || {};
			playerConfig.auth.authCallbackName = "paellaserver_authCallback";
			playerConfig.auth.userDataCallbackName = "paellaserver_loadUserDataCallback";
			playerConfig.plugins.enablePluginsByDefault = true;
			playerConfig.plugins.list["es.upv.paella.extendedTabAdapterPlugin"] = { enabled:false };
			playerConfig.plugins.list["es.upv.paella.multipleQualitiesPlugin"] = { enabled:true, showWidthRes: true };
			playerConfig.plugins.list["es.upv.paella.visualAnnotationPlugin"] = { enabled: true, url: "/rest/video/"};
			playerConfig.plugins.list["es.upv.paella.usertracking.GoogleAnalyticsSaverPlugIn"] = {
				"enabled": true,
				"trackingID": "UA-26470475-7"
			};

			if ( playerIndexPath == 'player/') {
				playerConfig.plugins.list["es.upv.paella.translecture.captionsPlugin"] = {
					"enabled": false,
					"tLServer": "https://fuster.cc.upv.es/tl-pm",
					"tLdb": "pm",
					"tLEdit": "/rest/plugins/translectures/redirectToEditor/${videoId}?lang=${tl.lang.code}"
				};
			}

			playerConfig.plugins.list["es.upv.paella.mediaserver.editor.videoExportsPlugin"] = {
				"enabled": true,
			};

			playerConfig.data = {
				"enabled": true,
				"dataDelegates": {
					"default": "CookieDataDelegate",
					"trimming": "MediaServiceTrimmingDataDelegate",
					"breaks": "MediaServiceBreksDataDelegate",
					"userInfo": "UserDataDelegate",
					"videoExports": "MediaServiceVideoExportsDataDelegate",
					"visualAnnotations": "VisualAnnotationsDataDelegate"
				}
			};

			res.json(playerConfig);
		}
	}

	router.get(['/player/index.html','/player/','/player/embed.html'], getPlayerIndex('player/'));
	router.get(['/playerDev/index.html','/playerDev/','/playerDev/embed.html','playerDev/editor.html'], getPlayerIndex('playerDev/'));
	router.get(['/playerDev/editor.html'], getEditorIndex('playerDev/'));

	router.get(['/player/config/config.json'],getPlayerConfig('player/'));
	router.get(['/playerDev/config/config.json'],getPlayerConfig('playerDev/'));

	app.listen(configure.config.connection.port, function() {
		console.log("Node server running on http://localhost:" + configure.config.connection.port);
	});

	var editorPlugin = ClientResources.getEditorJavascript('plugins');
	editorPlugin = traceurApi.compile(editorPlugin, { blockBinding:true });
	router.get(['/playerDev/editor-plugins.js'],function(req,res) {
		res.send(editorPlugin);
	});
	router.get(['/player/editor-plugins.js'],function(req,res) {
		res.send(editorPlugin);
	});
}

var options = {
	server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};


/*
mongoose.connect(configure.configFile.db.url, options, function(err, res) {
	if (err) throw err;
	console.log("Conected to polimedia");
	configure.checkInitConfig(function() {
		startServer();
	});
});
*/


mongoose.connect(configure.configFile.db.url, options);

var conn = mongoose.connection;
conn.once('open', function() {
	console.log("Connected to DB");
	configure.loadConfig(function() {
		startServer();
	});
});



