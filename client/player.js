
var paellaserver_authCallback = function(redirect) {
	redirect = redirect ? "?redirect=" + encodeURIComponent(redirect): "";
	return "/#/auth/login" + redirect;
};

var paellaserver_loadUserDataCallback = function(onSuccess) {
	var authData = {
		permissions: {
			canRead: true,
			canContribute: false,
			canWrite: false,
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
			onSuccess(authData);
		},
		function(data) {
			authData.loadError = true;
			onSuccess(authData);
		});

};
