(function() {
	var plugin = angular.module('adminPluginConfig');


	plugin.controller("AdminConfigController", ['$scope', 'ConfigCRUD', 'MessageBox', function($scope, ConfigCRUD, MessageBox){
	
		$scope.loading = true;
		ConfigCRUD.query({}).$promise.then(function(data){
			delete(data.$promise);
			delete(data.$resolved);			
			$scope.configs = data;
			$scope.loading = false;
		});
		
		$scope.saveConfig = function() {
			MessageBox("ERROR", "Function unimplemented");
		}
		
	}]);
})();