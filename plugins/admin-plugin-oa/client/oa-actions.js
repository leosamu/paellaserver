(function() {
	var plugin = angular.module('adminPluginOA');
	
	
	plugin.run(['Actions', '$q', '$http', function(Actions, $q, $http) {

		Actions.registerAction(
			{
				context: "oa",			
				label: "Subir a Youtube",
				role: "YOUTUBE_UPLOADER",
				runAction: function(v) {					
					return $http.post('/rest/plugins/admin-plugin-oa/video/' + v._id + '/uploadToYoutube')
				}
			}
		);	
				
	}]);	
})();