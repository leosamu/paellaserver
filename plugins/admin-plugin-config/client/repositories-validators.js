(function() {
	var plugin = angular.module('adminPluginConfig');

	plugin.directive('repositoryCheckUnique', ['$q', '$timeout', 'RepositoryCRUD', function($q, $timeout, RepositoryCRUD) {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				var timeoutTimer = null;
				
				ctrl.$asyncValidators.catalogCheckUnique = function(modelValue, viewValue) {
				
					if (ctrl.$isEmpty(modelValue)) {
						// consider empty model valid
						return $q.when();
					}
					
					var def = $q.defer();
					
					if (timeoutTimer) {
						$timeout.cancel(timeoutTimer);
					}
					timeoutTimer = $timeout(function(){
						RepositoryCRUD.query({id:modelValue}).$promise
						.then(
							function(){ def.reject(); },
							function(){ def.resolve();}
						);
						timeoutTimer = null;
					}, 500);
					
					
					return def.promise;
				};
			}
		};
	}]);
		
	
})();