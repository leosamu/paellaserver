(function() {
	var plugin = angular.module('adminPluginUsers');
	
	
	plugin.directive('userRolesList', function(){
		return {
			restrict: 'E',
			scope: {
				roles: "=",
			},
			controller: ['$scope', function($scope){
				$scope.deleteRole = function(r) {
					var index = $scope.roles.indexOf(r);
					if (index > -1) {
						$scope.roles.splice(index, 1);
					}
				};
				
				$scope.addRole = function() {
					$scope.roles.push($scope.addRoleText);
					$scope.addRoleText = null;
				};
			}],			
			templateUrl: 'admin-plugin-users/views/directives/user-roles-list.html'
		};
	});	
	
})();