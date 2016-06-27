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
			console.log(video.pluginData)
			if ( (video) && (video.pluginData) && (video.pluginData.translectures) ) {			
				var tlInfo = video.pluginData.translectures;
				tlAPI.getTlAPI(tlInfo).then(
					function(api) {
						api.langs(video._id).then(
							function(status) {
								res.status(200).send(status);
							},
							function(){
								console.log("1");
								res.sendStatus(500);
							}
						);
					},
					function(){
						console.log("2");
						res.sendStatus(500);
					}
				)			
			}
			else {
				console.log("3");
				res.sendStatus(500);
			}
		}]
	}	
}
