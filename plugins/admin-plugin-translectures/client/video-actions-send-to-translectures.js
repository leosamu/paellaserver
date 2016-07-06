(function() {
	var app = angular.module('adminPluginTranslectures');
	
	app.run(['Actions', '$q', '$http', function(Actions, $q, $http) {

		Actions.registerAction(
			{
				context: "video",			
				label: "Enviar a transLectures",
				role: "ADMIN",
				
				isDisabled: function(items) {
					return (items.length == 0);
				},
				
				runAction: function(v) {				
					return $http.put('/rest/plugins/admin-plugin-translectures/ingest/' + v._id);
				}
			}
		);
				
	}]);	
})();