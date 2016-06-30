(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.run(['Actions', '$q', 'TaskCRUD', function(Actions, $q, TaskCRUD) {

		Actions.registerAction(
			{
				context: "video",
				label: "Recodificar videos",
				isDisabled: function(items) {
					return (items.length == 0);
				},
				
				runAction: function(v) {
				
					var tasks = [
						{ task: "encode" },
						{ task: "md5" },
						{ task: "extractSlides" }
					];
				
					var workflowParams = JSON.stringify(tasks);
					var workflow = {
						task: "workflow",
						targetType: "video",
						targetId: v._id,
						processing : false,
						error: false,
						parameters: workflowParams
					};
					
					return TaskCRUD.save(workflow).$promise;
				}
			}
		);
				
	}]);	
})();