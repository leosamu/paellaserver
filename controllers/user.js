
var mongoose = require('mongoose');

// Load user data
// 	Input: req.params.id
//	Output: req.data
exports.LoadUser = function(req,res,next) {
	var Video = require(__dirname + '/../models/user');
	var select = '-search -processSlides';
	Video.find({ "_id":req.params.id})
		.select(select)
		.exec(function(err,data) {
			req.data = data;
			next();
		});
};

// Search user using contact data field
// 	Search query:  example: 'auth.UPV.nip'
// 	Input: req.params.search: search string
//	Output: req.data
exports.Search = function(field,type) {
	type = type || "string";
	return function (req, res, next) {
		var User = require(__dirname + '/../models/user');
		var select = '-search -processSlides';
		var query = {};
		switch (true) {
			case /string/i.test(type):
				query[field] = String(req.params.search);
				break;
			case /integer/i.test(type):
			case /number/i.test(type):
			case /int/i.test(type):
				query[field] = Number(req.params.search);
				break;
			case /bool/i.test(type):
			case /boolean/i.test(type):
				query[field] = Boolean(req.params.search);
				break;
		}
		User.find(query)
			.select(select)
			.exec(function (err, data) {
				req.data = data;
				next();
			});
	}
};