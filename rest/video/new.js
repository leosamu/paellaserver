var fs = require('fs');
var path = require('path');

var Task = require(__dirname + '/../../models/task');
var Video = require(__dirname + '/../../models/video');
var Catalog = require(__dirname + '/../../models/catalog');
var Repository = require(__dirname + '/../../models/repository');

var VideoController = require(__dirname + '/../../controllers/video');
var CommonController = require(__dirname + '/../../controllers/common');
var AuthController = require(__dirname + '/../../controllers/auth');

var catalogId = "politube";


function move (oldPath, newPath, callback) {
	fs.rename(oldPath, newPath, function (err) {
		if (err) {
			if (err.code === 'EXDEV') {
				copy();
			} else {
				callback(err);
			}
			return;
		}
		callback();
	});

	function copy () {
		var readStream = fs.createReadStream(oldPath);
		var writeStream = fs.createWriteStream(newPath);

		readStream.on('error', callback);
		writeStream.on('error', callback);
		readStream.on('close', function () {

			fs.unlink(oldPath, callback);
		});

		readStream.pipe(writeStream);

	}
}

function ensureFolderExists(p, mask, cb) {	
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(p, mask, function(err) {
        if (!err) {
	        return cb(null); // successfully created folder
        }
        else {
	        switch (err.code) {
	            case 'EEXIST':
	            	cb(null); // ignore the error if the folder already exists
	            	break;
	            case 'ENOENT':
	                ensureFolderExists(path.dirname(p), mask, function (err) {
	                    if (err) cb(err);
	                    else ensureFolderExists(p, mask, cb);
	                });
	                break;
	            default:
		            cb(err); // something else went wrong
	            	break;
	        }
	    }
    });
}


exports.routes = {
	createVideo: { 
		upload:'file',	
		post:[
			AuthController.EnsureAuthenticatedOrDigest,
			function(req,res,next) {			
				var video = req.body.videoData;
			
				Catalog.findOne({ "_id": catalogId })
				.populate('defaultRepository')
				.populate('defaultRepositoryForMasters')
				.exec(function(err, catalog) {
					if (err) return res.sendStatus(500);
														
					video.catalog =  catalogId;
					video.repository = catalog.defaultRepository;
					video.owner = [req.user._id];
					video.creationDate = new Date();					
					video.source = {
						type: "polimedia",
						masters:{
							repository: catalog.defaultRepositoryForMasters,							
						}
					}
					
					req.data = video;
					next();										
				});			
			},
			VideoController.CreateVideo,
			function(req,res,next) {
				var video = req.data;
								
				var repoFolder = video.source.masters.repository.path + video._id;
				ensureFolderExists(repoFolder, function(err) {
					if (err) {
						Video.remove({ _id: video._id }, function(err) {
							return res.sendStatus(500);
						});
					}
					else {			
						var destinationFile = repoFolder + '/master' + path.extname(req.file.originalname);					
						move(req.file.path, destinationFile, function(err) {
							if (err) {
								return res.sendStatus(500);	
							}
							var name = 'master' + path.extname(req.file.originalname);
							video.source.masters.files = [{
								name: name,
								tag: 'presenter/transcode',
							}];
	
							Video.update({"_id": video._id}, {
								"$set": { "source.masters.files":	video.source.masters.files }
							}, function(err) {
								if (err) {
									return res.sendStatus(500);
								}								
								req.data = video;
								next();
							});
						});
					}
				});

			},
			function(req,res, next) {				
				var tasks = [
					{ task: "encodeFromMasters", cancelOnError: true },
					{ task: "calculateDuration", cancelOnError: false  },
					{ task: "extractSlides", cancelOnError: false  },
					{ task: "encode", cancelOnError: false },
					{ task: "md5", cancelOnError: false  },
					{ task: "notify", cancelOnError: false  }
				];
				
				var workflowParams = JSON.stringify(tasks);				
				var workflow = new Task({
					task: 'workflow',
					error: false,
					targetType: 'video',
					targetId: req.data._id,
					parameters: workflowParams
				});
				
				workflow.save(workflow, function(err){
					if (err) { return res.sendStatus(500); }
					Video.update({_id: req.data._id}, {$set:{"source.masters.task": workflow._id}}, function(err){
						if (err) { return res.sendStatus(500); }						
						next();					
					});
				})
			},
			CommonController.JsonResponse
		]
	}
}