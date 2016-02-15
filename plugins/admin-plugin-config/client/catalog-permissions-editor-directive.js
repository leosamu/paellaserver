(function() {
	var plugin = angular.module('adminPluginConfig');
	
	plugin.directive("catalogPermissionsEditor", function(){
		return {
			restrict: 'E',
			scope: {
				permissions: "="	
			},
			controller: ['$scope', function($scope){
				$scope.addPermission = function() {
					$scope.permissions.push({
						role: $scope.addRoleText,
						read: $scope.addRoleRead,
						write: $scope.addRoleWrite,
						update: $scope.addRoleUpdate
					});
					$scope.addRoleText = null;
					$scope.addRoleRead = false;
					$scope.addRoleWrite = false;
					$scope.addRoleUpdate = false;
				};
				
				$scope.deletePermission = function(p) {
					console.log(p);
					
					var index = $scope.permissions.indexOf(p);					
					if (index > -1) {
						$scope.permissions.splice(index, 1);
					}
					
				}
			}],
			templateUrl: 'admin-plugin-config/views/directives/catalog-permissions-editor.html'
		}
	});	
	
	
})();