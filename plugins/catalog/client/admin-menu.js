(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('adminMenu',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/admin-menu.html",
			scope: {
			},
			controller: ['$scope','Channel', function ($scope,Channel) {
				$scope.canAdmin = true;
				$scope.status = {
					isopen: false
				}
			}]
		};
	});

})();

