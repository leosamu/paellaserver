/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util');
var BearerStrategy = require('passport-http-bearer').Strategy;
var request = require('request');
var iconv = require('iconv-lite');

var APICallError = require('./errors/apicallerror');


/**
 * Creates an instance of `Strategy`.
 *
 **/
function Strategy(options, verify) {
	var self = this;
	if (typeof options == 'function') {
    	verify = options;
    	options = {};
    }


	if (!verify) { throw new TypeError('SIUPV authentication requires a verify callback'); }

	function verifyInTheMiddle(req, token, done) {
		if (!self._passReqToCallback) {
			done = token;
			token = req;
			req = null;
		}
			
		var parts =  token.split(":");
		if (parts.length == 2) {
			var appToken = parts[0]
			var appUpvUUID = parts[1];			
	
			request.post(self._UPVauthorizationURL,
				{
					auth: {
						user: self._UPVuser,
						pass: self._UPVpassword,
						sendImmediately: true
					},			
					form:{
						token: appToken,
						UPV_UUID: appUpvUUID,
						id_user: self._UPVIdUser
					},
					encoding:null,
					headers:{
						'Content-type': "application/x-www-form-urlencoded; charset=ISO-8859-1"
					}
				},
				function(error, response, body) {
					var jbody = {};
					try {
						jbody = JSON.parse(iconv.decode(body,'iso-8859-1'));
					}
					catch(e) {}				
				
					if (error) {					
						return done(new APICallError('Error calling authorization URL ' + self._UPVauthorizationURL, 500));					
					}
					else if (response.statusCode>=400) {
						return done(new APICallError(jbody.error || response.statusMessage, response.statusCode));					
					}
					else {								
						if (self._passReqToCallback) {
							self._realVerify(req, jbody, done);
						} else {
							self._realVerify(jbody, done);
						}
					}
				}
			);
		}
		else {
			return done(new APICallError('Error in bearer token format', 500));					
		}
	}

	BearerStrategy.call(this, options, verifyInTheMiddle);
	
	this.name = 'remote-apps-upv';
	this._realVerify = verify;
	this._UPVauthorizationURL = options.UPVauthorizationURL || 'https://siupv.upv.es/oauth/check/';
	this._UPVuser = options.UPVuser;
	this._UPVpassword = options.UPVpassword;
	this._UPVIdUser = options.UPVIdUser;
}  


/**
 * Inherit from `BearerStrategy`.
 */
util.inherits(Strategy, BearerStrategy);




/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
