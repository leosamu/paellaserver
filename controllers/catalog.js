
var Catalog = require(__dirname + '/../models/catalog');
var Q = require('q');

exports.catalogsCanAdminister = function(user) {
	var deferred = Q.defer();

	var roles = user.roles.map(function(a) {return a._id;});
	var isAdmin = user.roles.some(function(a) {return a.isAdmin;});
	
	var query = {};
	if (!isAdmin){
		query = {permissions: {$elemMatch: { role: {$in: roles}, write: true }}};
	}	
	Catalog.find(query, function(err, elems){
		if (err) {
			return deferred.reject(err);
		}
		var catalogs = elems.map(function(a) {return a._id;});		
		deferred.resolve(catalogs);
	});

	return deferred.promise;
};

exports.CheckWriteInCatalog = function(catalog){
	return function(req, res, next) {
		
		var roles = req.user.roles.map(function(a) {return a._id;});
		var isAdmin = req.user.roles.some(function(a) {return a.isAdmin;});
		
		if (isAdmin) {
			next();
		}
		else {
			var query = {_id: catalog, permissions: {$elemMatch: { role: {$in: roles}, write: true }}};
			Catalog.findOne(query, function(err, elem){			
				if (err) {
					return req.status(500).json({ status:false, message:err.toString() });
				}
				if (!elem){
					return res.sendStatus(500);
				}
				else {
					next();
				}
			});
		}
	};
};

exports.CheckWrite = function(req, res, next) {
	var catalog = req.body && req.body.catalog;
	if (!catalog) {
		return res.sendStatus(500);
	}
	return (exports.CheckWriteInCatalog(catalog))(req,res,next);				
};
