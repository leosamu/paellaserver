
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

// Load only the public user data (name and lastname)
exports.LoadBasicUserData = function(req,res,next) {
	var User = require(__dirname + '/../models/user');
	var select = '-search -processSlides -auth -roles -contactData.email';
	User.find({ "_id":req.params.id})
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

// Search users that have videos of type Polimedia
//	Input: none
//	Output: req.data
exports.Authors = function(type) {
	return function(req,res,next) {
		var Video = require(__dirname + '/../models/video');
		Video.aggregate([
				{
					$match: {
						"source.type" : type
					}
				},
				{ $unwind : "$owner" },
				{
					$group: {
						_id: "$owner",
						count: { $sum: 1 }
					}
				}
			],
			function(err,result) {
				if (err) {
					req.status(500).json({ status:false, message:err.toString() });
				}
				else {
					req.data = result;
					next();
				}
			}
		);
	}
};

// Create user
//	Input: req.body: the user object
//	Output: req.data: the new user object, with the identifier
exports.CreateUser = function(req,res,next) {
	var User = require(__dirname + '/../models/user');
	var userData = req.body;
	if (!userData.contactData || !userData.contactData.name || !userData.contactData.email) {
		res.status(401).json({ status:false, message:"Invalid user data" });
	}
	else {
		if (!userData.roles || !userData.roles.length) {
			userData.roles = [ "USER" ];
		}
		var newUser = new User(userData);
		newUser.save(function(err,result) {
			req.data = result;
			next();
		});
	}
};


