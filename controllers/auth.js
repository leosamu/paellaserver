
// Login
//	in: params.login, query.pass
//	out: call next if success. Returns an error to the client if fail
exports.Login = function(req,res,next) {
	var login = req.params.login;
	var pass = req.query.pass;
	if (login && pass) {
		var User = require(__dirname + '/../models/user');
    	User.findOne({"auth.polimedia.login":login,"auth.polimedia.pass":pass})
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
		User.findOne({"auth.polimedia.login":login})
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
//	out: call next if the current user have at least a role in roles. Returns an error to the client if not
exports.CheckAccess = function(roles) {
	return function(req,res,next) {
		var userRoles = ["USER"];	// TODO: get user roles
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
