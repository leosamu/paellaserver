(function() {
	var app = angular.module('adminPluginVideos');
	
	app.directive("permissionsEditor", function(){
		return {
			restrict: 'E',
			scope: {
				permissions: "="	
			},
			controller: ['$scope', function($scope){
				$scope.addPermission = function() {
					var exist = $scope.permissions.some(function(element, index, array) {
						return (element.role == $scope.addRoleText);
					});
					if (exist == false) {
						$scope.permissions.push({
							role: $scope.addRoleText,
							read: $scope.addRoleRead,
							write: $scope.addRoleWrite
						});
						$scope.addRoleText = null;
						$scope.addRoleRead = false;
						$scope.addRoleWrite = false;
					}
				};
				
				$scope.deletePermission = function(p) {
					var index = $scope.permissions.indexOf(p);					
					if (index > -1) {
						$scope.permissions.splice(index, 1);
					}
				}
			}],
			templateUrl: 'admin-plugin-contents/views/directives/permissions-editor.html'
		}
	});	
	
	
})();