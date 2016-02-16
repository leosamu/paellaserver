var ChannelModel = require(__dirname + '/../../../../../../models/channel');

var AuthController = require(__dirname + '/../../../../../../controllers/auth');
var CatalogController = require(__dirname + '/../../../../../../controllers/catalog');

exports.routes = {
	removeVideo: { param:'video',
		patch: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req, res, next) {
				ChannelModel.findOne({"_id": req.params.id }, function(err, channel) {
					if(err) { return res.sendStatus(500); }
					CatalogController.CheckWriteInCatalog(channel.catalog)(req, res, next);
				});
			},
			function(req,res) {
				ChannelModel.update({"_id": req.params.id }, {$pull:{children: req.params.video}}, function(err) {
					if(err) { return res.sendStatus(500); }
					res.sendStatus(204);
				});
			}
		]
	}
}
