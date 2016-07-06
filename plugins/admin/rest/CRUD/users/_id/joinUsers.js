var UserModel = require(__dirname + '/../../../../../../models/user');
var ChannelModel = require(__dirname + '/../../../../../../models/channel');
var VideoModel = require(__dirname + '/../../../../../../models/video');
var AuthController = require(__dirname + '/../../../../../../controllers/auth');
var Q = require('q');

exports.routes = {
	joinUsers: {
		patch: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {					
				UserModel.findOne({"_id": req.params.id }, function(err, item){
					if (err) { return res.sendStatus(500); }
					if (!item) { return res.sendStatus(404); }
										
					UserModel.findByIdAndUpdate({"_id": req.params.id }, req.body.user).exec(function(ell, item) {
						if (err) { return res.sendStatus(500); }
						var pv = VideoModel.update(
							{ owner: {$in:req.body.remove} },
							{ $addToSet: {owner: req.body._id} },
							{ multi: true }
						).exec().then(function(){
							return VideoModel.update(
								{ owner: {$in:req.body.remove} },
								{ $pull: {owner: {$in: req.body.remove}} },
								{ multi: true }
							).exec();
						});

						var pc = ChannelModel.update(
							{ owner: {$in:req.body.remove} },
							{ $addToSet: {owner: req.body._id} },
							{ multi: true }
						).exec().then(function(){
							return ChannelModel.update(
								{ owner: {$in:req.body.remove} },
								{ $pull: {owner: {$in: req.body.remove}} },
								{ multi: true }
							).exec();
						});
						
						Q.all([pv,pc]).then(
							function(){
								UserModel.remove({_id: {$in: req.body.remove}}, function(err){
									if (err) { return res.sendStatus(500); }
									res.sendStatus(204);
								});
							},
							function(){
								res.sendStatus(500);
							}
						);						
					});
				});				
			}
		]
	}
	
}
