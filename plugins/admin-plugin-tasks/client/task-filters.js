(function() {
	var app = angular.module('adminPluginTasks');

	
	app.run(['$q', 'Filters', 'CatalogCRUD', function($q, Filters, CatalogCRUD) {

				
		Filters.registerFilter("task",
			{
				"label": "Con error",
				"field": "error",
				"type": "enum",
				"values": [
					{
						"value": true, "label": "Si"
					},
					{
						"value": false, "label": "No"
					}
				]
			}
		);
		

	}]);
	
		
})();