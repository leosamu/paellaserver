(function() {
	var app = angular.module('adminPluginVideos');

	
	app.run(['$q', 'Filters', 'CatalogCRUD' , function($q, Filters, CatalogCRUD) {

		Filters.registerFilter('channel',
			{
				"label": "Fecha creación",
				"field": "creationDate",
				"type": "timeInterval"
			}
		);
		
				
		Filters.registerFilter("channel",
			{
				label: "Catalogo",
				type: "enum",
				values: function() {
					var deferred = $q.defer();
					CatalogCRUD.query({type:"channel", limit:100}).$promise.then(
						function(v) {
							var ret = [];
							v.list.forEach(function(e){
								ret.push({
									value: e._id,
									label: e._id + " - " + e.description
								});
							})
							deferred.resolve(ret);
						},
						function() {
							deferred.reject();
						}
					);
					return deferred.promise;
				},
				field: "catalog"				
			}
		);		
		
		
	}]);
		
})();