var Catalog = require(__dirname + '/../../../models/catalog');
var AuthController = require(__dirname + '/../../../controllers/auth');
var configure = require("../../../configure.js");


exports.routes = {
	config: { 
		put: [			
			function(req, res) {
				res.sendStatus(404);				
			}			
		]
	}	
}
