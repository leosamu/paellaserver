/*
	404 - Not Found
	204 - Updated
	201 - Created
	200 - Response
	400 - Bad Request
	403 - Forbiden
	401 - Unauthorized
	500 - Internal Server Error
*/

var Video = require(__dirname + '/../../../models/video');
var Catalog = require(__dirname + '/../../../models/catalog');
var AuthController = require(__dirname + '/../../../controllers/auth');
var CatalogController = require(__dirname + '/../../../controllers/catalog');





exports.routes = {
	videos: { 
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req,res) {			
				var skip = req.query.skip || 0;
				var limit = req.query.limit || 100;
				var filters = {}; //JSON.parse(new Buffer(req.query.filters, 'base64').toString());
								
				//var isAdmin = req.user.roles.some(function(a) {return a.isAdmin;});					
				//var qcatalogs = (isAdmin)? {} : {"catalog": {"$in": catalogs}};
				var query = {"$and":[
					{deletionDate: {$eq: null}}, 
					{owner:req.user._id}, 
					filters
				]};
				
				Video.find(query).count().exec(function(errCount, count) {
					if(errCount) { return res.sendStatus(500); }
					
					Video.find(query)
					.select("-blackboard -operator -repository -search -source")
					.sort({creationDate:-1})
					.skip(skip)
					.limit(limit)
//					.populate('repository')
					.populate('owner', '_id contactData')					
					.exec(function(err, items) {
						if(err) { return res.sendStatus(500); }
						
						res.status(200).send({
							total: count,
							skip: Number(skip),
							limit: Number(limit),
							list:items							
						});
					});					
				});
							
			}
		]
	},
	deleteVideo: {
		param:'id',
		delete: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req, res) {
				Video.findOne({_id: req.params.id, owner: req.user._id}, function(err, item){
					if(err) { console.log("---"); console.log(err); return res.sendStatus(500); }
					if (item == null) {
						return res.sendStatus(404);
					}
					else {
						Video.update({_id: req.params.id},{'$set':{deletionDate: new Date()}}, function(err){
							if(err) { return res.sendStatus(500); }
							return res.sendStatus(200);
						})
					}				
				})
			}
		]
	}
}

