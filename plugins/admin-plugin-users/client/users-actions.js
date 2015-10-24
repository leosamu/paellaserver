(function() {
	var app = angular.module('adminPluginUsers');
	
	
	app.run(['Actions', '$q', '$modal', function(Actions, $q, $modal) {

		Actions.registerAction(
			{
				context: "user",			
				label: "Unir los usuarios",
				beforeRun: function(items) {
					var deferred = $q.defer();
										
					var modalInstance = $modal.open({
						template: "<h1>Hola</h1>"
					});
										
					deferred.resolve({});
					
					return modalInstance.result;
				},
								
				runAction: function(v) {
					var ms = Math.floor((Math.random() * 10000) + 1);
				
					var deferred = $q.defer();

					setTimeout(function() {
						console.log("TODO: Unir los usuarios " + v._id);
						deferred.resolve("");
					}, ms);
					
					return deferred.promise;
				}
			}
		);
				
	}]);	
})();