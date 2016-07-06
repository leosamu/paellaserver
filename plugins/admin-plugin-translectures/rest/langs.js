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
						api.langs(video._id).then(
							function(status) {
								res.status(200).send(status);
							},
							function(){
								res.sendStatus(500);
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
