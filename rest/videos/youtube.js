var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../controllers/video');
var CommonController = require(__dirname + '/../../controllers/common');
var AuthController = require(__dirname + '/../../controllers/auth');

exports.routes = {
	getYoutubeVideos: {
		get: [
			VideoController.Where("this.pluginData && this.pluginData.youtube && this.pluginData.youtube.id",
				'-slides -hidden -roles -duration -source -repository -thumbnail ' +
				'-hiddenInSearches -canRead -canWrite ' +
				'-deletionDate ' +
				'-metadata -search -processSlides '
			),
			function(req,res,next) {
				if (req.data) {
					req.data.forEach(function(video) {
						video.pluginData = {
							youtube: {
								id:video.pluginData.youtube.id
							}
						}
					});
				}
				next();
			},
			VideoController.LoadThumbnails,
			CommonController.JsonResponse ]
	},

	getVideo: {
		param:'id',
		get:[
			VideoController.Where("this.pluginData && this.pluginData.youtube && this.pluginData.youtube.id==':id'",
				'-slides -hidden -roles -duration ' +
				'-hiddenInSearches -canRead -canWrite ' +
				'-deletionDate ' +
				'-metadata -search -processSlides '
			),
			VideoController.LoadUrlFromRepository,
			CommonController.JsonResponse
		]
	}
};