(function() {
	var app = angular.module('adminModule');
	
		
	
	app.directive("adminFilterDirective", function(){
	
		return {
			restrict: 'E',
			require: 'ngModel',
			scope: {
				filters: "=ngModel",
				selectableFiltes: "="
			},
			controller: ['$scope', function($scope) {
				$scope.filters  = $scope.filters || [];
				$scope.addingFilter = false;								
								
				$scope.addEnumFilter = function() {
					$scope.filters.push({
						filter: $scope.filterSelected,
						value: $scope.filterParam
					});
					$scope.filterSelected = null;
					$scope.filterParam = null;
					$scope.addingFilter = false;
				};
				$scope.addTextFilter = function() {
					$scope.filters.push({
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
					$scope.filters.push({
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
					var idx =  $scope.filters.indexOf(f);
					if (idx > -1) {
						$scope.filters.splice(idx, 1);
					}
				};				
				

			}],
			templateUrl: 'admin/views/filters-directive.html'
		};
	});
	
	
	
	app.directive("adminVideoEditorPlugins", ['$compile', function($compile){
		return {
			restrict: 'E',
			scope: {
				plugins: "="
			},
			link: function(scope, element, attrs, ctrl) {			
				var accordion= $compile("<accordion close-others='oneAtATime'></accordion>")(scope);		
				element.append(accordion)			
				scope.$watch('plugins', function () {
					var plugins = scope.plugins || {};			
					var keys = Object.keys(plugins);					
					keys.forEach(function(k){				
						accordion.append($compile('<accordion-group heading="'+k+'"><h4>TODO</h4></accordion-group>')(scope));
					});	
				});
			}
		};
	}]);


	
})();