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
				var sort = req.query.sort;
				var searchText = req.query.q;
								
				var filters = {}; //JSON.parse(new Buffer(req.query.filters, 'base64').toString());
								
				//var isAdmin = req.user.roles.some(function(a) {return a.isAdmin;});					
				//var qcatalogs = (isAdmin)? {} : {"catalog": {"$in": catalogs}};


				var queryroles = []
				req.user.roles.forEach(function(r){ queryroles.push(r._id); });

				
				var queries = [
					{$or: [
						{deletionDate: {$eq: null}},
						{deletionDate: {$exists: false}},
					]},
					{$or: [
						{owner:req.user._id},
						{permissions: { $elemMatch: {
							role: {$in: queryroles},
							write: true
						}}}
					]},
				]
				if ((searchText!=undefined) && (searchText!='')) {
					queries.push({ '$text': {'$search': searchText} });
				}

				var query = {"$and":queries};				
				//console.log(JSON.stringify(query));
				
				
				Video.find(query).count().exec(function(errCount, count) {
					if(errCount) { return res.sendStatus(500); }
					
					var C = Video.find(query)
					.select("-blackboard -operator -search")
					if (sort == 'date') {
						C = C.sort({creationDate:-1});
					}
					else if (sort == 'title') {
						C = C.sort({title:+1});
					}
					C.skip(skip)
					.limit(limit)
					.populate('repository')
					.populate('owner', '_id contactData')					
					.populate('catalog', '_id description')	
					.populate('source.masters.task', '_id error processing')										
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

