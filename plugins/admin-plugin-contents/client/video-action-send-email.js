(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.run(['Actions', '$q', '$modal', '$http', function(Actions, $q, $modal, $http) {
	
		Actions.registerAction(
			{
				context: "video",			
				label: "Send email to owners",							
				
				isDisabled: function(items) {
					return (items.length == 0);
				},
				
				runAction: function(v) {
					return $http.post('/rest/plugins/admin-plugin-contents/videos/' + v._id + '/sendMail');
				}				
			}
		);
	}]);	
})();