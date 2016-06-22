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

var Translectures = require(__dirname + '/../../models/translectures');
//var Video = require(__dirname + '/../../../../models/video');
//var Catalog = require(__dirname + '/../../../../models/catalog');
var AuthController = require(__dirname + '/../../../../controllers/auth');
var CatalogController = require(__dirname + '/../../../../controllers/catalog');





exports.routes = {
	listTLServers: {
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				var skip = req.query.skip || 0;
				var limit = req.query.limit || 10;
				var query = {};
				if (req.query.filters != null) {
					query = JSON.parse(new Buffer((req.query.filters), 'base64').toString());
				}
							
				Translectures.find(query).count().exec(function(errCount, count) {
					if(errCount) { return res.sendStatus(500); }
					
					Translectures.find(query)
					.sort({priority:-1, creationDate:-1})					
					.skip(skip)
					.limit(limit)
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
	
	addTLServer: {
		post: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				var item = new Translectures(req.body);
				
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
	
	
	getTLServer: {
		param: 'id',
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				var query = {};				
				
				Translectures.findById(req.params.id)
				.exec(function(err, item) {
					if(err) { return res.sendStatus(500); }
					
					if (item) {
						res.status(200).send(item);
					}
					else {
						res.sendStatus(404);
					}
				});					
			}
		]
	},
	
	removeTLServer: {
		param: 'id',
		delete: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				Translectures.remove({"_id": req.params.id }, function(err, status) {
					if (!err) {
						if (status.result.n > 0) {
							res.sendStatus(204);
						}
						else {
							res.sendStatus(500);							
						}
					}
					else {
						res.sendStatus(500);
					}
			    });					
			}
		]
	},

	updateTLServer: {
		param: 'id',
		patch: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				Translectures.update({"_id": req.params.id }, req.body, {overwrite: true}, function(err) {
					if(err) { return res.sendStatus(500); }
					res.sendStatus(204);
				});
			}
		]
	}	
}

