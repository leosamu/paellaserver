(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.run(['Actions', '$q', '$modal', 'TaskCRUD', function(Actions, $q, $modal, TaskCRUD) {
	
		Actions.registerAction(
			{
				context: "video",			
				label: "Send email to owners",							
				
				isDisabled: function(items) {
					return (items.length == 0);
				},
				
				runAction: function(v) {
					var task1 = {
						task: "notify",
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