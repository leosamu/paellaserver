var Channel = require(__dirname + '/../../../../../models/channel');
var AuthController = require(__dirname + '/../../../../../controllers/auth');

exports.routes = {
	ingest: { 
		get: [
			function(req, res) {
				Channel.findOne({"pluginData.sakai.code": req.params.site}, function(err, item) { 
					if (err) {
						return res.sendStatus(500);
					}
					if (item) {
						var redirectUrl = "/embed.html/#catalog/channel/" + item._id
						res.redirect(302, redirectUrl);
						//res.send(redirectUrl)
					}
					else {
						// TODO: ¿autocreate channels?
						res.sendStatus(404);
					}
				})				
			}
		]
	}	
}
