/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util')
  , url = require('url')
  , https = require('https');
  
//var Iconv  = require('iconv').Iconv;
var iconv = require('iconv-lite');

/**
 * `Strategy` constructor.
 */
function Strategy(options, verify) {
	if (!verify) { throw new TypeError('UPV authentication requires a verify callback'); }
	if (!options.cua) { throw new TypeError('UPV authentication requires a cua option'); }
	if (!options.profileInfo) { throw new TypeError('UPV authentication requires a profileInfo option'); }

	passport.Strategy.call(this);
	this.name = 'upv';
	this._verify = verify;
	
	this._cua = options.cua;
	this._tickets = options.tickets || ["TDP", "TDX", "TDp"];
	this._profileInfo = options.profileInfo;


	this._passReqToCallback = options.passReqToCallback;
}  


/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);


/**
 * Authenticate request.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
	options = options || {};
	var self = this;
	var coockies = self._getCoockies(req);	
	var ip = req.headers['x-forwarded-for'] || 
		req.connection.remoteAddress || 
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;


		
	var ticket = undefined;
	self._tickets.forEach(function(t) {
		ticket = ticket || coockies[t];
	})
	
	
	if (!ticket) {
		if (coockies["TDP"] || coockies["TDp"] || coockies["TDX"]) {
			return self.fail("User not allowed to login");
		}
		else {
			return this.redirect(self._cua);
		}
	}		
	
	https.get('https://www.upv.es/dir/autt/media/'+ip+'?'+ticket, function(res) {	
		res.setEncoding('binary');
		var body = '';
		res.on('data', function(chunk) {
			return body += chunk;
		});
		res.on('end', function() {	
//			var iconv_latin1 = new Iconv('latin1', 'utf-8');	
//			body = iconv_latin1.convert(new Buffer(body, 'binary')).toString('utf-8');
			body = iconv.decode(new Buffer(body), 'iso-8859-1');
			
			if (body.substr(0,5) == "ERROR") {
				return self.fail(body);
			}
			else {
				var profile = self._parseProfileExt(body, self._profileInfo);
				
				function verified(err, user, info) {
					if (err) { return self.error(err); }
					if (!user) { return self.fail(info); }
					self.success(user, info);
				}
				
				try {
					if (self._passReqToCallback) {
						self._verify(req, profile, verified);
					}
					else {
						self._verify(profile, verified);
					}
				}
				catch (ex) {
					return self.error(ex);
				}
			}
		});
	}).on('error', function(e) {
		return self.error(new Error(e));
	});
};





Strategy.prototype._getCoockies = function(req) {
	var list = {},
	rc = req.headers.cookie;
	
	rc && rc.split(';').forEach(function( cookie ) {
		var parts = cookie.split('=');
		list[parts.shift().trim()] = unescape(parts.join('='));
	});
	
	return list;		
};
	
	
/**
 * Parse user profile from UPV response.
 *
 * @param {Object} params
 * @api private
 */
Strategy.prototype._parseProfileExt = function(body, profileInfo) {
	var profile = {};
			
	var arrBody = body.split("\n");
	var i = 0;
	profileInfo.forEach(function(p) {
		profile[p] = arrBody[i];
		i = i+1;
	});
	
	return profile;
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
