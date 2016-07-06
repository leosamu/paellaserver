
var upv = require(__dirname + '/controllers/upv');
var User = require(__dirname + '/models/user');
var mongoose = require("mongoose");
var configure = require("./configure");

function saveUpvData(user, upvData) {
	var upv = {
		dni: upvData.dni,
		nip: upvData.nip
	};
	User.findOne({ _id:user._id }, function(err, data) {
		if (data && data.auth) {
			User.update({ _id:user._id },{ $set:{ "auth.UPV": upv } },
					function(err,numAffected) {
						console.log("User " + user._id + " updated");
					});
		}
		else if (data) {
			User.update({ _id:user._id },{ $set:{ "auth": { UPV:upv } } },
					function(err,numAffected) {
						console.log("User " + user._id + " updated");
					});
		}
	});
}

function addUpvData(user) {
	if (user && user.contactData && user.contactData.email) {
		(function searchUser(userData,mail) {
			upv.Utils.userByEmail(user.contactData.email)
					.then(function(upvData) {
						try {
							upvData = JSON.parse(upvData);
							if (upvData.dni) {
								saveUpvData(userData,upvData);
							}
						}
						catch (e) {

						}

					})
					.fail(function(err) {
						console.log(err.message);
					});
		})(user, user.contactData.email);
	}

}

function importUpvData() {
	console.log("Import upv data");
	User.find({},function(err,data) {
		if (data) {
			data.forEach(function(user) {
				addUpvData(user);
			});
		}
	});
}

var db = mongoose.connection;

var options = {
	server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
mongoose.connect(configure.configFile.db.url, options);

var conn = mongoose.connection;
conn.once('open', function() {
	importUpvData();
});





