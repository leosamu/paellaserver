var Video = require(__dirname + '/../../../../../models/video.js');

exports.routes = {
	added: { get: [
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
			
			Video.count(match, function( err, count){			
				if (err) {
					res.status(501);
					return res.end();
				}
				Video.aggregate([
					{ $match: match },
					{ $group: { _id: "$catalog", count: { $sum: 1 } } },
					{ $sort: { count: -1 }}
				])
				.exec(function(err, catalogs){
					if (err) {
						res.status(501);
						return res.end();					
					}
					res.json({
						count: count,
						catalogs: catalogs
					});
				});
			});
		}
	]}
};