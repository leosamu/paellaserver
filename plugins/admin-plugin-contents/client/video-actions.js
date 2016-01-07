(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.run(['Actions', '$q', 'TaskCRUD', function(Actions, $q, TaskCRUD) {

		Actions.registerAction(
			{
				context: "video",
				label: "Recodificar videos",
				runAction: function(v) {
					var task1 = {
						task: "encode",
						targetType: "video",
						targetId: v._id,
						error: false
					};
					var task2 = {
						task: "extractSlides",
						targetType: "video",
						targetId: v._id,
						error: false
					};
					
					return TaskCRUD.save(task1).$promise.then(function(){
						return TaskCRUD.save(task2).$promise;
					});
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