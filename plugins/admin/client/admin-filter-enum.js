(function() {
	var plugin = angular.module('adminModule');	

	plugin.directive('adminFilterEnum', [function(){
		return {
			restrict: 'E',
			scope: {
				filter: "=",
				addFilter: "&"
			},		
			templateUrl: 'admin/views/directives/admin-filter-enum.html',
			controller: ["$scope", function($scope) {
			
				$scope.addEnumFilter = function() {
					$scope.addFilter({
						params: $scope.filterParam
					});
				}
			}]
		};
	}]);

})();