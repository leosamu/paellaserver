(function() {
	var plugin = angular.module('adminPluginYoutube');


	plugin.run(['Actions', '$q', 'TaskCRUD', function(Actions, $q, TaskCRUD) {

		Actions.registerAction(
			{
				label: "Upload videos to Youtube",
				context: "channel",
				role: "YOUTUBE_UPLOADER",
				runAction: function(v) {
					var task1 = {
						task: "uploadChannelToYoutube",
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