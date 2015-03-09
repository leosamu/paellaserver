
var CSRFController = require(__dirname + '/../../../controllers/csrf');
var CommonController = require(__dirname + '/../../../controllers/common');

exports.routes = {
	test: { get:[
		CSRFController.CheckToken,
		function(req,res,next) {
			req.data = {
				status:true,
				message:"Hello, this is a test"
			};
			next();
		},
		CommonController.JsonResponse
	]}
}