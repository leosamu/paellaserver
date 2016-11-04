var passport = require('passport');
var express = require("express");

var UPVStrategy = require('../../passport-upv').Strategy;

var Services = require("../../services");
var UPVUserProvider = require("./upv-user-provider.js");
var UPVRoleProvider = require("./upv-role-provider.js");
var UPVSakaiRoleProvider = require("./upv-sakai-role-provider.js");


var upvUserProvider = new UPVUserProvider();
var upvRoleProvider = new UPVRoleProvider();
var upvSakaiRoleProvider = new UPVSakaiRoleProvider();


Services.UserServices.registerUserProvider(upvUserProvider);
Services.RoleServices.registerRoleProvider(upvRoleProvider);
Services.RoleServices.registerRoleProvider(upvSakaiRoleProvider);



passport.use(new UPVStrategy({
		cua: "https://www.upv.es/pls/soalu/est_intranet.NI_dual?P_CUA=media",
		tickets: ["TDP", "TDX", "TDp"],
		profileInfo: ['nip', 'dni', 'login', 'email', 'fullName']
	},
	function(profile, done) {		
		upvUserProvider.getOrCreateUserByAuthInfo(profile)
		.then(
			function(user) {
				done(null, user);
			},
			function(err) {
				done(err);
			}
		);
	}
));



var router = express.Router();
router.get('/auth/upv',
	function(req,res,next) {
		req.session.redirect = req.query.redirect;
		next();
	},
	function(req, res, next) {
		passport.authenticate('upv', function(err, user, info){
			if (err) { return next(err); }
			if (!user) { return res.redirect('//www.upv.es/bin2/error-session'); }
			
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				next();
			});			
		})(req, res, next);
	},
	function(req,res) {
		var redirect = req.session.redirect || "/";
		res.redirect(redirect);
	}
);


 
router.get('/rest/plugins/upvauth/validate',
	function(req,res,next) {
		req.session.redirect = req.query.redirect;
		next();
	},
	function(req, res, next) {
		passport.authenticate('upv', function(err, user, info){
			if (err) { return next(err); }
			if (!user) { return res.redirect('//www.upv.es/bin2/error-session'); }
			
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				next();
			});			
		})(req, res, next);
	},
	function(req,res) {
		var redirect = req.session.redirect || "/";
		res.redirect(redirect);
	}
);


/*****************************************
 *
 * AutoLogin
 *
 *****************************************/ 
function autoLogin(req,res,next) {
	passport.authenticate('upv', function(err, user, info){
		if (err) { return next(); }
		if (!user) { return next(); }
	
		req.logIn(user, function(err) {
			next();
		});					
	})(req, res, next);	
}


// Force autologin
forceAutoLoginDomains = ["poliformat.upv.es"]
forceAutoLoginRoutes = ['/player/', '/player/index.html', '/player/embed.html']



router.use(function(req,res,next){
	var url = require('url');
	var autologin = false;
			
	var ticket = undefined;
	["TDP", "TDX", "TDp"].forEach(function(t) {
		ticket = ticket || req.cookies[t];
	})
		
	if (ticket != undefined) {
		if (!req.isAuthenticated()) {
			autologin = true;
		}
		else if (req.headers.referer) {
			var u = url.parse(req.headers.referer);
			var isDomain = forceAutoLoginDomains.some(function(d){ return (d == u.hostname); });
			var isRoute = forceAutoLoginRoutes.some(function(p){ return (p == req.path); });
			
			if( isDomain && isRoute ) {				
				autologin = true;
			}
		}
	}
			
	
	if (autologin == true) {
		console.log("autologin true");
		autoLogin(req, res,next);
	}
	else {
		next();
	}
});	









module.exports.router = router;
