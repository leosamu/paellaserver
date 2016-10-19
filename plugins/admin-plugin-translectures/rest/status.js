var VideoController = require(__dirname + '/../../../controllers/video');
var AuthController = require(__dirname + '/../../../controllers/auth');
var TranslecturesModel = require('../models/translectures.js');

var request = require('request');

var tlAPI = require('../API')




exports.routes = {
	status: { param: 'id', get: [
		VideoController.LoadVideo,
		function(req,res,next) {			
			var video = req.data[0];
			if ( (video) && (video.pluginData) && (video.pluginData.translectures) ) {			
				var tlInfo = video.pluginData.translectures;
				tlAPI.getTlAPI(tlInfo).then(
					function(api) {
						if (video.pluginData.translectures.ingestedId) {
							api.status(video.pluginData.translectures.ingestedId).then(
								function(status) {
									res.status(200).send(status);
								},
								function(err){
									res.sendStatus(err || 500);
								}
							);
						}
						else {
							res.sendStatus(404);
						}
					},
					function(err){
						res.sendStatus(err || 500);
					}
				)			
			}
			else {
				res.sendStatus(500);
			}
		}]
	}
}
