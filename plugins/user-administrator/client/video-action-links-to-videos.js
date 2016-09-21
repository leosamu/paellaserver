(function() {
	var plugin = angular.module('userAdminModule');

	plugin.run(['ItemActions', '$modal', function(ItemActions, $modal) {

		ItemActions.registerAction(
			{
				label: "Get links to videos",
				context: ["user-videos-list"],
				
				roles: [],
				isDisabled: function(items) {
					return (items.length <=0);
				},
				
				beforeRun: function(items) {										
					var modalInstance = $modal.open({
						templateUrl:'user-administrator/views/modal/links-to-videos.html',
						resolve:{
							videos: function() {
								return items;
							}
						},
						backdrop: true,
						controller:['$scope', '$modalInstance', 'videos', function($scope, $modalInstance, videos){
							$scope.videos = videos;

							$scope.accept = function () {
								$modalInstance.close();
							};								
						}]
					});
		
					return modalInstance.result
					.then(function() {
						return false;
					});					
				},
				
				runAction: function(item, params) {
					return;
				}
			}
		);
	}]);

	
})();