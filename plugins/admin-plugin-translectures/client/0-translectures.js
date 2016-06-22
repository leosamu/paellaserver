(function() {
	var plugin = angular.module('adminPluginTranslectures', ['AuthorizationRoutesModule']);

	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
	
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/translectures/, "ADMIN");
	
		$routeProvider
		.when('/admin/translectures', {
			templateUrl: 'admin-plugin-translectures/views/translectures-list.html',
			controller: "AdminTranslecturesListController"
		})
		.when('/admin/translectures/edit/:id', {
			templateUrl: 'admin-plugin-translectures/views/translectures-edit.html',
			controller: "AdminTranslecturesEditController"
		})
		.when('/admin/translectures/new', {
			templateUrl: 'admin-plugin-translectures/views/translectures-new.html',
			controller: "AdminTranslecturesNewController"
		})
	
	}]);

	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/translectures", "Translectures");	
	
})();

