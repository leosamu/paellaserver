(function() {
	var app = angular.module('adminPluginUsers');

	app.run(['$q', 'Filters', 'RoleCRUD', function($q, Filters, RoleCRUD) {
	
		Filters.registerFilter("user",
			{
				label: "Roles",
				type: "enum",
				values: function() {
					var deferred = $q.defer();
					RoleCRUD.query({limit:100}).$promise.then(
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
				field: "roles"				
			}
		);
		
	}]);
})();