var Catalog = require(__dirname + '/../../../models/catalog');
var AuthController = require(__dirname + '/../../../controllers/auth');
var configure = require("../../../configure.js");


exports.routes = {
	config: { 
		get: [			
			function(req, res) {
				Catalog.findOne({_id:"videoapuntes"})
				.select("_id defaultRepository defaultRepositoryForChannels defaultRepositoryForMasters")
				.populate("defaultRepository defaultRepositoryForChannels defaultRepositoryForMasters", "id path")
				.exec(function(err, catalog) {
					if (err) { return res.sendStatus(500);}
					
					if (catalog) {
						res.send({catalog: catalog});						
					}
					else {
						res.sendStatus(404);
					}
				})
				
			}			
		]
	}	
}
