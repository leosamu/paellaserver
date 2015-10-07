(function() {
	var app = angular.module('adminModule');
	
		
	app.provider('VideoFilters', function () {		
		var filters = [];
		
		return {		
			registerFilter: function (filter) {
				filters.push(filter);
			},
			
			$get: function () {
				return filters;
			}
		};
	});	


	app.factory('VideoActions', function () {
		var actions = [];
		
		return {
			registerAction: function (action) {
				actions.push(action);
			},
			
			$get: function () {
				return actions;
			}
		};
	});	

	
})();