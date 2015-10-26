(function() {
	var app = angular.module('adminPluginDB');
	
	app.directive("permissionsEditor", function(){
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
						write: $scope.addRoleWrite
					});
					$scope.addRoleText = null;
					$scope.addRoleRead = false;
					$scope.addRoleWrite = false;
				};
				
				$scope.deletePermission = function(p) {
					console.log(p);
				}
			}],
			templateUrl: 'admin-plugin-db/views/directives/permissions-editor.html'
		}
	});	
	
	
})();