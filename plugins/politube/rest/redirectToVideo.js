var Video = require(__dirname + '/../../../models/video');

exports.routes = {
	redirectToEditor: { param: 'id', get: [
		function(req,res) {			
			Video.findOne({"pluginData.politube.indexer": parseInt(req.params.id)}, function(err, video){
				var redirect = "/";
				if (video != null) {
					redirect = "/player/?id=" + video._id + "&autoplay=true"
				}
				res.redirect(302, redirect);				
			});
		}]
	}
}
