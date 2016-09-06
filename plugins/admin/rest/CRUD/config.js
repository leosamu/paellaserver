/*
	404 - Not Found
	204 - Updated
	201 - Created
	200 - Response
	400 - Bad Request
	403 - Forbiden
	401 - Unauthorized
	500 - Internal Server Error
*/

var AuthController = require(__dirname + '/../../../../controllers/auth');
var configure = require(__dirname + '/../../../../configure');

exports.routes = {
	list: { 
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				res.status(200).send(configure.config);
			}
		]
	}
}







