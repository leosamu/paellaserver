(function() {

	var plugins = angular.module('adminPluginsModule', []);

	plugins.registerPlugin = function(module, route, label) {
		plugins.requires.push(module.name);
		
		
		plugins.config(['AdminPluginProvider', function(AdminPluginProvider) {
			AdminPluginProvider.register(route, label);
		}]);
	}	
		
	plugins.provider('AdminPlugin', function() {
		var plugins = [];
		
		return {
			register: function(mainRoute, label){
				plugins.push({route: mainRoute, label: label});
			},
			
			$get: function(){
				return plugins;
			}
		};
	});	
	
	
	plugins.directive("adminPluginsMenu", function(){
	
		return {
			restrict: 'E',
			replace: true,
			controller: ['$scope', 'AdminPlugin',  function($scope, AdminPlugin) {
				$scope.plugins = AdminPlugin;
			}],
			templateUrl: 'admin/views/directives/admin-plugins-menu.html'
		};
	
	
	
	});
	
})();