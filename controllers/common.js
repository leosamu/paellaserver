
var CSRFController = require(__dirname + '/csrf');

// Json output
//	Input: req.data (object)
//	Output: none
exports.JsonResponse = function(req,res) {
	CSRFController.GenToken(req,res);
	res.json(req.data);
}

// List query pagination
//	Input: req.query.limit, req.query.skip or none
//	Output: req.query.limit, req.query.skip. Default: limit:100, skip:0
exports.Paginate = function(req,res,next) {
	if (!req.query.limit) req.query.limit = 100;
	if (!req.query.skip) req.query.skip = 0;
	next();
}

