var Video = require(__dirname + '/../../../../../models/video.js');

exports.routes = {
	count: { get: [
		function(req,res,next) {
			//req.query.fromDate
			//req.query.toDate
			
			var matchAND = [];
			var match = {};
			if (req.query.fromDate) {
				matchAND.push({ "creationDate":{"$gte": new Date(parseInt(req.query.fromDate))}});
			}
			if (req.query.toDate) {
				matchAND.push({ "creationDate":{"$lte": new Date(parseInt(req.query.toDate))}});
			}
			if (matchAND.length > 0){
				match = {"$and": matchAND};
			}
			
			Video.aggregate([
				{ $match: match },
				{ $unwind: "$owner" },
				{ $group: { _id: "$owner", count: { $sum: 1 } } },
				{ $sort: { count: -1 }},
				{ $limit : 100 }
			])
			.exec(function(err, catalogs){
				if (err) {
					res.status(501);
					return res.end();					
				}
				
				var opts = [{ path: '_id', model: 'User', select: 'contactData.lastName contactData.name' }];
				Video.populate(catalogs,opts, function(err, ee){				
					res.json(ee);
				});
			});
		}
	]}
};