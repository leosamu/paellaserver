(function() {
	var app = angular.module('adminPluginYoutube');
	
	
	app.run(['Actions', '$q', 'TaskCRUD', function(Actions, $q, TaskCRUD) {

		Actions.registerAction(
			{
				context: "video",			
				label: "Subir a Youtube",
				role: "ADMIN",

				runAction: function(v) {
					var task1 = {
						task: "uploadToYoutube",
						targetType: "video",
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