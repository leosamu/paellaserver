(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.run(['Actions', '$q', '$modal', function(Actions, $q, $modal) {

		Actions.registerAction(
			{
				label: "test",
				context: "channel",
				beforeRun: function(items) {
					var deferred = $q.defer();
										
					var modalInstance = $modal.open({
						template: "<h1>Hola</h1>"
					});
										
					deferred.resolve({});
					
					return modalInstance.result;					
					//return deferred.promise;					
				},
				
				runAction: function(item, params) {
					console.log(params);
					var ms = Math.floor((Math.random() * 10000) + 1);
				
					var deferred = $q.defer();
					setTimeout(function() {
						console.log("TODO: test " + item._id);
						deferred.resolve("");
					}, ms);
					
					return deferred.promise;
				}
				
			}
		);
				
	}]);	
})();