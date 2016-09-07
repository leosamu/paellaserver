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

var Channel = require(__dirname + '/../../../models/channel');
var Catalog = require(__dirname + '/../../../models/catalog');
var AuthController = require(__dirname + '/../../../controllers/auth');
var CatalogController = require(__dirname + '/../../../controllers/catalog');





exports.routes = {
	channels: { 
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

				Channel.aggregate([
					{
					    $match: {owner: req.user._id}
					},
					{
					    $unwind: "$children"
					},
					{
					    $group: {
					        _id: "$owner",
					        items: {$addToSet: "$children"}
					    }
					}
				]).exec()
				.then(
					function(items) {
						var items = [];
						if (items.length > 0) {
							items = items[0].items;
						}
	
						var queries = [
							{$or: [
								{deletionDate: {$eq: null}},
								{deletionDate: {$exists: false}},
							]},
							{owner:req.user._id},
							{_id: {"$nin": items}}							
						];
						if ((searchText!=undefined) && (searchText!='')) {
							queries.push({ '$text': {'$search': searchText} });
						}						
	
						var query = {"$and": queries};
						Channel.find(query).count().exec(function(errCount, count) {
							if(errCount) { return res.sendStatus(500); }
							
							var C = Channel.find(query)
							.select("-blackboard -operator -search -source");
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
					},
					function(err) {
						return res.sendStatus(500);
					}
				);		
			}
		]
	},
		
	getChannel: {
		param:'id',
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req, res) {			
				Channel.findOne({_id: req.params.id, owner: req.user._id})
				.populate('videos children')
				.exec(function(err, item){
					if(err) { return res.sendStatus(500); }
					if (item == null) {
						return res.sendStatus(404);
					}
					else {
						Channel.populate(item, {path: 'videos.repository', model: 'Repository'})
						.then(function(item){
							return Channel.populate(item, {path: 'children.repository', model: 'Repository'});
						})
						.then(function(item){
							return Channel.populate(item, {path: 'videos.owner', model: 'User', select: 'contactData'});
						})
						.then(function(item){
							return Channel.populate(item, {path: 'children.owner', model: 'User', select: 'contactData'});
						})
						.then(function(item){
							res.send(item);
						});
					}
				})
			}
		]
	},
	
	updateChannel: {
		param:'id',
		put: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req, res) {			
				Channel.update({_id: req.params.id, owner: req.user._id}, req.body)
				.exec(function(err, status){
					if(err) { return res.sendStatus(500); }
					if (status.ok == true) {
						Channel.findOne({_id: req.params.id}, function(err, item){
							item.updateSearchIndex();
						});
						return res.sendStatus(204);
					}
					else {
						return res.sendStatus(404);
					}
				})
			}
		]
	},	
	
	deleteChannel: {
		param:'id',
		delete: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req, res) {
				Channel.findOne({_id: req.params.id, owner: req.user._id}, function(err, item){
					if(err) { return res.sendStatus(500); }
					if (item == null) {
						return res.sendStatus(404);
					}
					else {
						Channel.update({_id: req.params.id},{'$set':{deletionDate: new Date()}}, function(err){
							if(err) { return res.sendStatus(500); }
							return res.sendStatus(200);
						})
					}				
				})
			}
		]
	}
}

