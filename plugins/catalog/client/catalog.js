(function() {
	var catalogModule = angular.module('catalogModule',["ngRoute"]);

	var CatalogController = function($scope,$http) {
		$http.get('rest/channels').success(function(data) {
			$scope.channels = data;
		});
	};
	CatalogController.$inject = ["$scope","$http"];
	catalogModule.controller('CatalogController',CatalogController);

	catalogModule.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/catalog',{
				templateUrl: 'catalog/views/main.html',
				controller: "CatalogController"
			});
	}]);
})();