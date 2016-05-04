(function() {
	var plugin = angular.module('adminPluginYoutube');


	plugin.run(['Actions', '$q', 'TaskCRUD', function(Actions, $q, TaskCRUD) {

		Actions.registerAction(
			{
				label: "Upload videos to Youtube",
				context: "channel",
				role: "YOUTUBE_UPLOADER",
				isDisabled: function(selectedChannels) {
					var disabled = true;
					if (selectedChannels.length > 0) {
						disabled = false;
						selectedChannels.forEach(function(ch){
							if (ch.catalog != 'youtube') {
								disabled = true;
							}
						});
					}
					return disabled;
				},
				runAction: function(ch) {
					if (ch.catalog != 'youtube') {
						console.log("Error! Channel is not in youtube catalog");
						var deferred = $q.defer();
						deferred.reject();
						return deferred.promise;
					}
					else {
						var task1 = {
							task: "uploadToYoutube",
							targetType: "channel",
							targetId: ch._id,
							error: false
						};
	
						return TaskCRUD.save(task1).$promise;
					}
				}
			}
		);
	}]);
})();