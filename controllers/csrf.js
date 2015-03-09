
var uuid = require('node-uuid');
var configure = require(__dirname + '/../configure');

// CSRF token output
//	Input: req.data (object)
//	Output: req.data.token
exports.GenToken = function(req,res) {
	if (configure.config.security.csrfCheck) {
		if (!req.session.csrfToken) {
			req.session.csrfToken = uuid.v4();
		}
		res.append('csrf-token',req.session.csrfToken);
	}
}

// CSRF token check
//	Input: req.query.token or req.body.token
//	Output: none or error
exports.CheckToken = function(req,res,next) {
	if (req.session.csrfToken!==undefined && configure.config.security.csrfCheck) {
		var paramName = "csrf-token";
		if (req.query["csrf-token"]!==undefined && req.query["csrf-token"]==req.session.csrfToken) {
			next();
    	}
    	else if (req.body["csrf-token"]!==undefined && req.body["csrf-token"]==req.session.csrfToken) {
    		next();
    	}
    	else if (req.get('csrf-token')!==undefined && req.get('csrf-token')==req.session.csrfToken) {
    		next();
    	}
    	else if (req.query["xsrf-token"]!==undefined && req.query["xsrf-token"]==req.session.csrfToken) {
        	next();
		}
		else if (req.body["xsrf-token"]!==undefined && req.body["xsrf-token"]==req.session.csrfToken) {
			next();
		}
		else if (req.get('xsrf-token')!==undefined && req.get('xsrf-token')==req.session.csrfToken) {
			next();
		}
    	else {
    		res.status(403).json({
    			status:false,
    			message:'Bad CSRF token'
    		})
    	}
	}
	else {
		next();
	}
}

