var AuthController = require('../../../controllers/auth');
var Config = require("../../../models/config");
var configure = require("../../../configure");


exports.routes = {
	getConfig: {
		get: [
			AuthController.CheckRole(['ADMIN']),			
			function(req, res) {
				if (!configure.config.videoapuntes) {
					configure.config.videoapuntes.config = {config:{}};
				}
				
				return res.send(configure.config.videoapuntes.config);
			}
		]
	},
	setConfig: {
		patch: [
			AuthController.CheckRole(['ADMIN']),			
			function(req, res) {			
				if (!configure.config.videoapuntes) {
					configure.config.videoapuntes = {};
				}					
				configure.config.videoapuntes.config = req.body;
				
				Config.findOne({_id:'videoapuntes'}, function(err, va){
					if (err) { return res.sendStatus(500); }
					if (va) {					
						Config.update({_id:'videoapuntes'}, {$set:{"value.config": req.body}}, function(err){
							if (err) { console.log(err); return res.sendStatus(500); }
							
							return res.sendStatus(204);
						});
					}
					else {
						va = new Config({_id:'videoapuntes', value:{config: req.body}});
						va.save(function(err) {
							if (err) { console.log(err); return res.sendStatus(500); }
							
							return res.sendStatus(204);
						});
					}
				});
			}
		]
	}

}
