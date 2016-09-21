(function() {
	var plugin = angular.module('userAdminModule');

	plugin.run(['ItemActions', '$modal', function(ItemActions, $modal) {

		ItemActions.registerAction(
			{
				label: "Get links to channels",
				context: ["user-channels-list"],
				
				roles: [],
				isDisabled: function(items) {
					return (items.length <=0);
				},
				
				beforeRun: function(items) {										
					var modalInstance = $modal.open({
						templateUrl:'user-administrator/views/modal/links-to-channels.html',
						resolve:{
							channels: function() {
								return items;
							}
						},
						backdrop: true,
						controller:['$scope', '$modalInstance', 'channels', function($scope, $modalInstance, channels){
							$scope.channels = channels;

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