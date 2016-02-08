(function() {
	var plugin = angular.module('adminModule');	

	plugin.directive('adminFilterTypeEnum', [function(){
		return {
			restrict: 'E',
			scope: {
				filter: "=",
				addFilter: "&"
			},		
			templateUrl: 'admin/views/directives/admin-filter-type-enum.html',
			controller: ["$scope", function($scope) {
			
				if (typeof $scope.filter.values === "function") {
					$scope.filter.values().then(function(v){
						$scope.values = v;
					})
				}
				else if ($scope.filter.values instanceof Array) {
					$scope.values = $scope.filter.values;
				}
			
				$scope.addEnumFilter = function() {
					$scope.addFilter({
						params: $scope.filterParam
					});
				}
			}]
		};
	}]);

})();