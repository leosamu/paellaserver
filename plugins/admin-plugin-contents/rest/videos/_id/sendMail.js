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

var Task = require(__dirname + '/../../../../../models/task');
var Video = require(__dirname + '/../../../../../models/video');
var AuthController = require(__dirname + '/../../../../../controllers/auth');
var CatalogController = require(__dirname + '/../../../../../controllers/catalog');

exports.routes = {	
	sendMail: {
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req, res, next) {						
				CatalogController.catalogsCanAdminister(req.user)
				.then(
					function(catalogs){
						var isAdmin = req.user.roles.some(function(a) {return a.isAdmin;});					
						var qcatalogs = (isAdmin)? {} : {"catalog": {"$in": catalogs}};
						var query = {"$and":[qcatalogs, {_id: req.params.id}]};

						Video.findOne(query).exec(function(err, video) {
							if(err) { return res.sendStatus(500); }
							
							if (video == null) {
								return res.sendStatus(500);								
							}
							next();
						});
					},
					function(){
						return res.sendStatus(500);
					}
				)
			},
			function(req,res) {			
				var item = new Task({
					task: "notify",
					targetType: "video",
					targetId: req.params.id,
					error: false,
					priority: 15
				});
				
				item.save(function(err) {
					if(!err) {
						res.status(201);
						res.send(item);
					}
					else {
						res.sendStatus(500);
					}
				});				
			}
		]
	},	
}







