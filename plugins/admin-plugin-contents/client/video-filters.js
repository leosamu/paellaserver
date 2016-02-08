(function() {
	var app = angular.module('adminPluginVideos');

	
	app.run(['$q', 'Filters', 'CatalogCRUD', function($q, Filters, CatalogCRUD) {

		Filters.registerFilter("video",
			{
				"label": "Fecha creación",
				"field": "creationDate",
				"type": "timeInterval"
			}
		);
		
		Filters.registerFilter("video",
			{
				label: "Catalogo",
				type: "enum",
				values: function() {
					var deferred = $q.defer();
					CatalogCRUD.query({type:"videos", limit:100}).$promise.then(
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
		
		Filters.registerFilter("video",
			{
				"label": "Tipo",
				"field": "source.type",
				"type": "enum",
				"values": [
					{
						"value": "polimedia", "label": "Video del portal"
					},
					{
						"value": "external", "label": "Externo"
					}
				]
			}
		);
				
		Filters.registerFilter("video",
			{
				"label": "OA",
				"field": "pluginData.OA.isOA",
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
		
		Filters.registerFilter("video",
			{
				"label": "Pendiente de subir",
				"field": "unprocessed",
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
		
		/*
		Filters.registerFilter("video",
			{
				"label": "Autor",
				"field": "owner",
				"type": "author"
			}
		);	
		*/
	}]);
	
		
})();