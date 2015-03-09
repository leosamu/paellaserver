var configure = require(__dirname + '/../configure');
var loginField = configure.config.security.loginField;
var passwField = configure.config.security.passwField;

// Login
//	in: params.login, query.pass
//	out: call next if success. Returns an error to the client if fail
exports.Login = function(req,res,next) {
	var login = req.params.login;
	var pass = req.query.pass;
	if (login && pass) {
		var User = require(__dirname + '/../models/user');
		var query = {};
		query[loginField] = login;
		query[passwField] = pass;
    	User.findOne(query)
			.exec(function(err,data) {
				if (data) {
					req.session.login = login;
					next();
				}
				else {
					req.session.login = null;
					res.status(401).json({
						status:false,
						message:"Invalid user or password"
					});
				}
			});
	}
	else {
		res.status(401).json({
			status:false,
			message:"Login error: password not specified"
		});
	}
}

// Log out current user
 exports.Logout = function(req,res,next) {
 	req.session.login = null;
 	next();
 }

// Get the current user data
//	req.userData: user data or null if there isn't any user logged in
exports.CurrentUser = function(req,res,next) {
	var login = req.session.login;
	if (login) {
		var User = require(__dirname + '/../models/user');
		User.findOne({loginField:login})
			.select("-__v")
			.exec(function(err,data) {
				req.userData = data;
				next();
			});
	}
	else {
		next();
	}
}

// Check access
//	in: req.userData
//	out: call next if the current user have at least a role in roles. Returns an error to the client if not
exports.CheckAccess = function(roles) {
	return function(req,res,next) {
		var userRoles = [];
		if (req.userData && req.userData.roles) {
			userRoles = req.userData.roles;
		}
		if (roles && roles.length>0) {
			for (var i=0; i<roles.length; ++i) {
				for (var j=0; j<userRoles.length; ++j) {
					if (roles[i]==userRoles[j]) {
						next();
						return;
					}
				}
			}
		}
		res.status(403).json({
			status:false,
			message:"Access denied"
		});
	}
}
