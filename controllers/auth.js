var passport = require('passport');
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
};

// Log out current user
 exports.Logout = function(req,res,next) {
	 req.logout();
	 req.session.destroy();
	 next();
 };

// Check access
//	in: req.user
//	out: call next if the current user have at least a role in roles. Returns an error to the client if not
exports.CheckAccess = function(roles) {
	if (typeof(roles)=="string") roles = [roles];
	return function(req,res,next) {
		var userRoles = [];
		var access = false;
		if (req.user && req.user.roles) {
			userRoles = req.user.roles;
		}
		if (roles && roles.length>0) {
			access = roles.some(function(role) {
				if (userRoles.indexOf(role)!=-1) {
					next();
					return true;
				}
			});
		}
		if (!access) {
			res.status(403).json({
				status: false,
				message: "Access denied"
			});
		}
	}
};

// Check if is authenticated
//	out: call next if the user is authenticated
exports.EnsureAuthenticatedOrDigest = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	if (req.headers['x-requested-auth'] == 'Digest') {
		passport.authenticate('digest', { session: false })(req, res, next);
	}
	else {
		res.status(401).json({
			status: false,
			message: "Access denied"
		});
	}
};

// Input: req.data: video data
// Output: req.data: the video data with the new roles
exports.LoadRoles = function(req,res,next) {
	function loadItemRoles(item) {
		if (!item.roles) {
			item.roles = [
				{
					"role":"ANONYMOUS",
					"read":true,
					"write":false
				},
				{
					"role":"USER",
					"read":true,
					"write":true
				}
			]
		}
		item.owner.forEach(function(owner) {
			item.roles.push({
				"role":owner,
				"read":true,
				"write":true
			});
		})
	}

	if (req.data && req.data.forEach) {
		req.data.forEach(function(itemData) {
			loadItemRoles(itemData);
		});
		next();
	}
	else {
		next();
	}
};
