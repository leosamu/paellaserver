(function() {
	var plugin = angular.module('adminPluginYoutube');
	
	
	plugin.run(['Actions', '$q', 'ChannelCRUD', '$modal', function(Actions, $q, ChannelCRUD, $modal) {

		Actions.registerAction(
			{
				label: "Sync with Youtube",
				context: "channel",
				//role: "YOUTUBE_UPLOADER",
				runAction: function(v) {
					var task1 = {
						task: "syncToYoutube",
						targetType: "channel",
						targetId: v._id,
						error: false
					};
					
					return TaskCRUD.save(task1).$promise;
					//role: "YOUTUBE_UPLOADER",
					//var deferred = $q.defer();
					//deferred.resolve();
					//return deferred.promise;
				}
			}
		);
	}]);	
})();