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
	passport.authenticate('upv', {}),
	function(req,res) {
		var redirect = req.session.redirect || "/";
		res.redirect(redirect);
	}
);

router.get('/rest/plugins/upvauth/validate',
	passport.authenticate('upv', {}),
	function(req,res) {
		var redirect = req.session.redirect || "/";
		res.redirect(redirect);
	}
);




module.exports.router = router;
