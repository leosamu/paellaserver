(function() {
	var app = angular.module('adminPluginYoutube');
	
	
	app.run(['Actions', '$q', '$http', function(Actions, $q, $http) {

		Actions.registerAction(
			{
				context: "video",			
				label: "Subir a Youtube",
				role: "YOUTUBE_UPLOADER",
				isDisabled: function(items) {
					return (items.length == 0);
				},

				runAction: function(v) {
					return $http.put('/rest/plugins/admin-plugin-youtube/video/'+v._id+'/uploadToYoutube');								
				}
			}
		);		
	}]);	
})();