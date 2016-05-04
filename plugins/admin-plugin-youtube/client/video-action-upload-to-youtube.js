(function() {
	var app = angular.module('adminPluginYoutube');
	
	
	app.run(['Actions', '$q', 'TaskCRUD', function(Actions, $q, TaskCRUD) {

		Actions.registerAction(
			{
				context: "video",			
				label: "Subir a Youtube",
				role: "YOUTUBE_UPLOADER",
				isDisabled: function(items) {
					return (items.length == 0);
				},

				runAction: function(v) {				
					var task1 = {
						task: "uploadToYoutube",
						targetType: "video",
						targetId: v._id,
						error: false
					};
					
					return TaskCRUD.save(task1).$promise;
				}
			}
		);		
	}]);	
})();