(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.run(['Actions', '$q', '$modal', 'VideoCRUD', function(Actions, $q, $modal, VideoCRUD) {
	
		Actions.registerAction(
			{
				context: "video",			
				label: "Add roles to videos",							
				
				beforeRun: function(items) {
					var deferred = $q.defer();
										
					var modalInstance = $modal.open({
						backdrop: true,
						templateUrl:'admin-plugin-videos/views/modal/video-action-add-role.html',
						controller:['$scope', '$modalInstance', function($scope, $modalInstance) {
							$scope.roles = [];
							
							$scope.cancel = function () {
								$modalInstance.dismiss();
							};								
							$scope.accept = function () {
								$modalInstance.close($scope.roles);
							};								
						}]
					});
		
					modalInstance.result
					.then(
						function(result) {
							deferred.resolve(result);
						},
						function(){
							deferred.reject();
						}
					);
													
					return deferred.promise;					
				},
				
				runAction: function(item, params) {
					return VideoCRUD.get({id: item._id}).$promise
					.then(function(video) {
						if (!video.permissions) { video.permissions = []}
						params.forEach(function(r){
							video.permissions.some(function(e,idx){
								if (e.role == r.role) {
									video.permissions.splice(idx,1);
									return true;
								}
								return false;
							});
						});
						
						video.permissions = video.permissions.concat(params);
												
						return VideoCRUD.update(video).$promise;						
					})					
				}				
			}
		);
	}]);	
})();