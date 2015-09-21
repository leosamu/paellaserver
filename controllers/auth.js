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
			// userRoles es un array de modelos, y tendría que ser un array de nombres de rol
			req.user.roles.forEach(function(roleItem) {
				userRoles.push(roleItem._id);
			});
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
		if (!item.permissions || item.permissions.length==0) {
			item.permissions = [
				{
					"role":"ANONYMOUS",
					"read":true,
					"write":false
				},
				{
					"role":"USER",
					"read":true,
					"write":false
				}
			]
		}
		else {
			item.permissions = JSON.parse(JSON.stringify(item.permissions));
		}
		item.owner.forEach(function(owner) {
			var ownerId = typeof(owner)=="string" ? owner:owner._id;
			item.permissions.push({
				"role":"ROLE_" + ownerId,
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
	else if (req.data && req.data._id) {
		loadItemRoles(req.data);
		next();
	}
	else {
		next();
	}
};

exports.getAnonymousUser = function() {
	return  {
		"_id":"0",
		"auth": {},
		"roles":[
			{"_id":"ANONYMOUS","description":"Anonymous user"}
		],
		"contactData": {
			"email":"",
			"lastName":"anonymous",
			"name":"Anonymous"
		}
	};
};

exports.CheckRole = function(roles) {
	return function(req,res,next) {
		var user = req.user;
		if (!user || !user.roles) {
			res.status(403).json({ status:false, message:"No user logged" });
		}
		else {
			var hasRole = user.roles.some(function(roleData) {
				return roles.some(function(role) {
						return roleData==role || roleData._id==role;
					});
			});
			if (hasRole) {
				next();
			}
			else {
				res.status(401).json({ status:false, message:"Not authorized" });
			}
		}
	}
};

// Checks if the current user can write a resource
//	in: req.data: a resource or a resource array with one element (the rest will be ignored)
//	out: call next if success, or returns a 403 if fail
exports.CheckWrite = function(req,res,next) {
	var user = req.user;
	var resource = req.data;
	var canWrite = false;
	if (Array.isArray(resource) && resource.length>0) {
		resource = resource[0];
	}
	if (!resource) {
		res.status(404).json({ status:false, message:"Resource not found"} );
	}
	else if (!user) {
		res.status(401).json({ status:false, message:"Authorization needed"} );
	}
	else {
		canWrite = user.roles.some(function(role) {
			return role.isAdmin || resource.permissions.some(function(permission) {
				return permission.role==role._id && permission.write;
			});
		});

		if (canWrite) {
			next();
		}
		else {
			res.status(403).json({ status:false, message:"You are not authorized to edit this resource"})
		}
	}
};