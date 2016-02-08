(function() {
	var plugin = angular.module('adminModule');
	
	
	function hasRole(role){								
		return function(element){
			return ((element._id == role) || element.isAdmin );
		};
	}
	
	plugin.directive('adminFilters', ["$compile", '$injector', "Filters", "User", function($compile, $injector, Filters, User){
		return {
			restrict: 'E',
			scope: {
				stateFilters: "=",
				type: "="
			},		
			link: function(scope, element, attrs) {
				scope.customFilterElement = element.find("#customFilter")
			},
			templateUrl: 'admin/views/directives/admin-filters.html',
			controller: ["$scope", function($scope) {
				$scope.stateFilters  = $scope.stateFilters || {};
				$scope.stateFilters.filters  = $scope.stateFilters.filters || [];
								
				$scope.addFilter = function(params) {					
					$scope.stateFilters.filters.push({
						filter: $scope.filterSelected,
						value: params
					});
					
					$scope.filterSelected = null;
					$scope.addingFilter = false;
				}
				
				$scope.removeFilter = function(f) {
					var idx =  $scope.stateFilters.filters.indexOf(f);
					if (idx > -1) {
						$scope.stateFilters.filters.splice(idx, 1);
					}
				};				
				
				$scope.$watch('filterSelected', function(value) {
					if (value != undefined) {											

						var typeLower = value.type.toLowerCase();
						var body = '';
						var pluginDirective = "admin-filter-type-" + typeLower;
						var directiveName = "adminFilterType" + typeLower[0].toUpperCase() + typeLower.slice(1) + "Directive";

						if ($injector.has(directiveName)) {					
							body = '<' + pluginDirective + ' filter="filterSelected" add-filter="addFilter(params)"></' + pluginDirective + '>';
						}						
						var e = $compile(body)($scope);
						$scope.customFilterElement[0].innerHTML="";
						$scope.customFilterElement.append(e);						
					}
				});
				$scope.$watch('type', function(value) {
					$scope.filters = [];
					
					Filters.$get(value).forEach(function(a){						
						if (a.role) {																
							if ( u.roles.some(hasRole(a.role)) ){
								$scope.filters.push(a);
							};
						}
						else {
							$scope.filters.push(a);
						}						
					});
				});
			}]
		};
	}]);
})();