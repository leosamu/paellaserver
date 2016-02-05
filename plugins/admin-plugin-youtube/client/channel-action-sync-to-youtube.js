(function() {
	var app = angular.module('adminPluginYoutube');
	
	
	app.run(['Actions', '$q', 'TaskCRUD', function(Actions, $q, TaskCRUD) {

		Actions.registerAction(
			{
				context: "channel",
				label: "Sync with Youtube",
				role: "YOUTUBE_UPLOADER",
				
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