(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.run(['Actions', '$q', 'TaskCRUD', function(Actions, $q, TaskCRUD) {

		Actions.registerAction(
			{
				context: "video",
				label: "Recodificar videos",
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


		Actions.registerAction(
			{
				context: "video",			
				label: "Enviar a transLectures",
				runAction: function(v) {
					var task1 = {
						task: "translectures",
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