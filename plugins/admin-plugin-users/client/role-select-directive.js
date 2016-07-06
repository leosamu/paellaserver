(function() {
	var plugin = angular.module('adminPluginUsers');
	
		
	plugin.directive("roleSelect", ['RoleCRUD', function(RoleCRUD){
		return {
			restrict: 'E',
			scope: {
				role: "="
			},
			link: function(scope, element, attrs) {
			
				var root = document.createElement('div');
				root.className = "control-group";				
				var select = document.createElement("select");
				root.appendChild(select);
				element.append(root);
								
				$(select).selectize({				
					valueField: '_id',
					labelField: '_id',
					searchField: ['_id', 'description'],
					options: [],
					create: false,
					render: {
						option: function(item, escape) {
							return '<div><b>' + item._id + '</b><small> - '+item.description+'</small></div>';
						}
					},
					load: function(query, callback) {
						if (!query.length) return callback();
						RoleCRUD.query().$promise.then(
							function(data){
								callback(data.list);
							},
							function() {
								callback();
							}
						);
					},
					onChange: function (value) {
						scope.$apply(function () {
							scope.role = value;
						});						
					}
				});
				
				scope.$watch('role', function(value) {
					if (!value) {
						setTimeout(function(){
							select.selectize.clearOptions();							
						}, 0);
					}
				});
			}
		}
	}]);	
	
})();