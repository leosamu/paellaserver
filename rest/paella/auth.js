var mongoose = require('mongoose');
var request = require('request');

var AuthController = require(__dirname + '/../../controllers/auth');
var VideoController = require(__dirname + '/../../controllers/video');

function checkOA(responseData,user,video,onSuccess) {
	var nip = "";
	var riunetUrl = "";
	try {
		if (user.auth.UPV.nip) {
			nip = user.auth.UPV.nip;
		}
	}
	catch (e) {}

	try {
		riunetUrl = video.pluginData.OA.url;
	}
	catch (e) {}

	var fullurl = "http://riunet.upv.es/upv/oa/OAConsultaPermisos?NIP_LECTOR=" + nip + "&URL_OA=" + riunetUrl + "&XML";
	request.get(fullurl,function(error,response, body){
		responseData.permissions.canRead = true;
		responseData.permissions.canWrite = false;
		responseData.permissions.canContribute = false;

		if (error) {
			responseData.permissions.error = true;
		}
		else if (body.search('<value type="raw">NO</value>') >=0 ){
			responseData.permissions.canRead = false;
		}
		onSuccess(error,responseData);
	});
}

exports.routes = {
	getAuthData: { param:'id', get:[
		VideoController.LoadVideo,
		AuthController.LoadRoles,
		function(req,res) {
			var video = req.data[0];
			var admin = false;
			var responseData = {
				permissions: {
					canRead: false,
					canContribute: false,
					canWrite: false,
					loadError: false,
					canShare: true,
					isAnonymous: !req.isAuthenticated()
				},
				userData: {
					username:'anonymous',
					name:'Anonymous',
					avatar:'resources/images/default_avatar.png'
				}
			};

			if (!req.user) {
				req.user = AuthController.getAnonymousUser();
			}

			responseData.userData.username = req.user.contactData.email;
			responseData.userData.name = req.user.contactData.name + " " + req.user.contactData.lastName;

			var canWrite = false;
			var canRead = false;
			video.roles.some(function(videoRole) {
				return req.user.roles.some(function(userRole) {
					if (userRole._id==videoRole.role) {
						canRead = canRead || videoRole.read;
						canWrite = canWrite || videoRole.write;
					}
					return canRead && canWrite;
				});
			});
			admin = req.user.roles.some(function(role) {
				return role.isAdmin;
			});

			responseData.permissions.canShare = !video.hideSocial;
			if (admin) {
				responseData.permissions.canRead = true;
				responseData.permissions.canWrite = true;
				responseData.permissions.canContribute = true;
				res.json(responseData);
			}
			else if (video.pluginData.OA &&
				video.pluginData.OA &&
				video.pluginData.OA.isOA) {
				checkOA(responseData,req.user,video,function(err,authData) {
					if (err) {
						res.status(500).json({ status:false });
					}
					else {
						res.json(authData);
					}
				});
			}
			else {
				responseData.permissions.canRead = canRead;
				responseData.permissions.canWrite = canWrite;
				responseData.permissions.canContribute = canWrite;
				res.json(responseData);
			}
		}]
	}
};
