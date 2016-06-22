var VideoController = require(__dirname + '/../../../../controllers/video');
var AuthController = require(__dirname + '/../../../../controllers/auth');
var TranslecturesModel = require('../../models/translectures.js');

var request = require('request');

var tlAPI = require('../../API')


exports.routes = {
	status: { param: 'lang', get: [
		VideoController.LoadVideo,
		function(req,res,next) {			
			var video = req.data[0];			
			if ( (video) && (video.pluginData) && (video.pluginData.translectures) ) {			
				var tlInfo = video.pluginData.translectures;
				tlAPI.getTlAPI(tlInfo).then(
					function(api) {
						api.dfxp(video._id, req.params.lang).then(
							function(status) {
								res.status(200).send(status);
							},
							function(err){
								res.sendStatus(err || 500);
							}
						);
					},
					function(){
						res.sendStatus(500);
					}
				)			
			}
			else {
				res.sendStatus(500);
			}
		}]
	}
}
