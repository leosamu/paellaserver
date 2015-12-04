(function() {
	var plugin = angular.module('adminPluginConfig');
	
		
	plugin.directive("catalogSelect", ['CatalogCRUD', function(CatalogCRUD){
		return {
			restrict: 'E',
			scope: {
				catalog: "=",
				type: "@"
			},
			link: function(scope, element, attrs) {
			
				var root = document.createElement('div');
				root.className = "control-group";				
				var select = document.createElement("select");
				//select.setAttribute('disabled', '');				
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
							var desc = "";
							if (item.description){
								desc = ' - <small>'+ item.description +'</small>';
							}
							return '<div><b>' + item._id + '</b>'+desc+'</div>';
						}
					},
					load: function(query, callback) {
						if (!query.length) return callback();
						CatalogCRUD.query({type:scope.type}).$promise.then(
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
							scope.catalog = value;
						});						
					}
				});
				
				scope.$watch('catalog', function(value) {
					setTimeout(function(){
						if (!value) {
							select.selectize.clearOptions();							
						}
						else {
							select.selectize.addOption({_id: value})
							//select.selectize.refreshOptions();
							select.selectize.setValue(value);
						}
					}, 0);			
				});
			}
		}
	}]);	
	
})();