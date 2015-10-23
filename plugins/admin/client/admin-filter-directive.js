(function() {
	var app = angular.module('adminModule');
	
		
	
	app.directive("adminFilterDirective", function(){
	
		return {
			restrict: 'E',
			scope: {
				stateFilters: "=",				
				availableFilters: "="
			},
			controller: ['$scope',  function($scope) {
				$scope.stateFilters  = $scope.stateFilters || {};
				$scope.stateFilters.filters  = $scope.stateFilters.filters || [];
				
				$scope.addingFilter = false;
								
				
								
				$scope.addEnumFilter = function() {
					$scope.stateFilters.filters.push({
						filter: $scope.filterSelected,
						value: $scope.filterParam
					});
					$scope.filterSelected = null;
					$scope.filterParam = null;
					$scope.addingFilter = false;
				};
				$scope.addTextFilter = function() {
					$scope.stateFilters.filters.push({
						filter: $scope.filterSelected,
						value: {
							value: $scope.filterParam,
							label: $scope.filterParam
						}
					});
					$scope.filterSelected = null;
					$scope.filterParam = null;
					$scope.addingFilter = false;					
				};
				
				$scope.addIntervalDateFilter = function() {
					$scope.stateFilters.filters.push({
						filter: $scope.filterSelected,
						value: {
							value: $scope.filterParam,
							label: moment($scope.filterParam.start).format('ll') + ' - ' + moment($scope.filterParam.end).format('ll')
						}
					});
					$scope.filterSelected = null;
					$scope.filterParam = null;
					$scope.addingFilter = false;
				}
				
				$scope.removeFilter = function(f) {
					var idx =  $scope.stateFilters.filters.indexOf(f);
					if (idx > -1) {
						$scope.stateFilters.filters.splice(idx, 1);
					}
				};				

			}],
			templateUrl: 'admin/views/directives/filters-directive.html'
		};
	});
	
})();