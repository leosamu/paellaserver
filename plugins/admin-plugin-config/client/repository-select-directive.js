(function() {
	var plugin = angular.module('adminPluginConfig');
	
		
	plugin.directive("repositorySelect", ['RepositoryCRUD', function(RepositoryCRUD){
		return {
			restrict: 'E',
			scope: {
				repository: "="
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
					searchField: ['_id'],
					options: [],
					create: false,
					render: {
						option: function(item, escape) {
							return '<div><b>' + item._id + '</b></div>';
						}
					},
					load: function(query, callback) {
						if (!query.length) return callback();
						RepositoryCRUD.query().$promise.then(
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
							scope.repository = value;
						});						
					}
				});
				
				scope.$watch('repository', function(value) {
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