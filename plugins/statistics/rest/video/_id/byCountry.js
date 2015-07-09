var crypto = require('request');

exports.routes = {
	redirectToEditor: { get: [
		function(req,res,next) {
			res.json([
	          ['ES', 200],
	          ['MX', 100],
	          ['Germany', 200],
	          ['United States', 300],
	          ['Brazil', 400],
	          ['Canada', 500],
	          ['France', 600],
	          ['RU', 700]
	        ]);
		}
	]}
};