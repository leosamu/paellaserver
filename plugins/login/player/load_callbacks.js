
var paellaserver_authCallback = function(redirect) {
	try {
		redirect = (redirect[0] == '/') ? redirect : "/"+redirect;
		redirect = "?redirect=" + encodeURIComponent(redirect);
	}
	catch(e) {
		redirect = "";
	}

	return "/#/auth/login" + redirect;
};

var paellaserver_loadUserDataCallback = function(onSuccess) {
	var authData = {
		permissions: {
			canRead: true,
			canContribute: false,
			canWrite: false,
			canShare: true,
			loadError: false,
			isAnonymous: true
		},
		userData: {
			username: 'anonymous',
			name: 'Anonymous',
			avatar: 'resources/images/default_avatar.png'
		}
	};

	base.ajax.get({ url:'/rest/paella/auth/' + paella.initDelegate.getId() }, function(data) {
			authData = data;
			if (!authData.permissions.canShare) {
				paella.player.config.plugins.list["es.upv.paella.socialPlugin"] = { enabled: false };
			}
			onSuccess(authData);
		},
		function(data) {
			authData.loadError = true;
			onSuccess(authData);
		});

};


function loadPlayer() {
	var containerId = "playerContainer";
	var resourcesPath = "../rest/paella";
	paella.load(containerId, { url:resourcesPath, auth: {
		authCallbackName: "paellaserver_authCallback",
		userDataCallbackName: "paellaserver_loadUserDataCallback"
	}});
}