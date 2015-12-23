(function() {
	var plugin = angular.module('adminPluginYoutube');
	
	
	plugin.run(['Actions', '$q', 'ChannelCRUD', '$modal', function(Actions, $q, ChannelCRUD, $modal) {

		Actions.registerAction(
			{
				label: "Sync with Youtube",
				context: "channel",
				
				runAction: function(item, params) {
					var deferred = $q.defer();
					deferred.resolve();
					return deferred.promise;
				}
			}
		);
	}]);	
})();