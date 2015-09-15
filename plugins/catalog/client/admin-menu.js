(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('adminMenu',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/admin-menu.html",
			scope: {
				currentUser:"=",
				currentChannel:"="
			},
			controller: ['$scope','Channel', function ($scope,Channel) {
				$scope.status = {
					isopen: false
				};

				$scope.showMenu = function() {
					return $scope.currentUser!=null;
				}
			}]
		};
	});

})();

