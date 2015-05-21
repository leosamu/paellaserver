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

		function(req,res) {
			var video = req.data[0];
			var responseData = {
				permissions: {
					canRead: true,
					canContribute: false,
					canWrite: false,
					loadError: false,
					isAnonymous: !req.isAuthenticated()
				},
				userData: {
					username:'anonymous',
					name:'Anonymous',
					avatar:'resources/images/default_avatar.png'
				}
			};

			if (req.user) {
				responseData.userData.username = req.user.contactData.email;
				responseData.userData.name = req.user.contactData.name + " " + req.user.contactData.lastName;
			}

			if (video.pluginData.OA &&
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
				res.json(responseData);
			}
		}]
	}
};
