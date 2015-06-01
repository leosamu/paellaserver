(function() {
	var legalModule = angular.module('legalModule', ["ngRoute", "ngResource"]);

	legalModule.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/termsofuse',{
				templateUrl: 'legal/views/en.html'
			}).

			when('/terminosdeuso', {
				templateUrl: 'legal/views/es.html'
			}).

			when('/termsdus', {
				templateUrl: 'legal/views/ca.html'
			});
	}]);
})();