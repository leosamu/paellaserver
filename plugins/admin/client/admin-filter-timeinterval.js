(function() {
	var plugin = angular.module('adminModule');	

	plugin.directive('adminFilterTimeinterval', [function(){
		return {
			restrict: 'E',
			scope: {
				filter: "=",
				addFilter: "&"
			},		
			templateUrl: 'admin/views/directives/admin-filter-timeinterval.html',
			controller: ["$scope", function($scope) {
			
				$scope.addIntervalDateFilter = function() {
					$scope.addFilter({
						params: {
							value: $scope.filterParam,
							label: moment($scope.filterParam.start).format('ll') + ' - ' + moment($scope.filterParam.end).format('ll')
						}
					});					
				}
			}]
		};
	}]);

})();