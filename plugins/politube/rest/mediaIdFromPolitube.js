var Video = require(__dirname + '/../../../models/video');

exports.routes = {
	mediaIdFromPolitube: { param: 'id', get: [
		function(req,res) {			
			Video.findOne({"pluginData.politube.indexer": parseInt(req.params.id)}, function(err, video){
				if (err) { return res.sendStatus(500);}

				if (video == null) {
					return res.sendStatus(404);
				}
				else {
					res.status(200).send({id: video._id})
				}
			});
		}]
	}
}
