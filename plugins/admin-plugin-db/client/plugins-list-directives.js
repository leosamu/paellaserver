(function() {
	var app = angular.module('adminPluginDB');

	app.directive("pluginsList", ['$compile', '$injector', '$filter',  function($compile, $injector, $filter){
		return {
			restrict: 'E',
			scope: {
				plugins: "="
			},
			link: function(scope, element, attrs) {
				if (!attrs.type) {
					throw new Error("Attribute type not defined")
				}
				
				var type = attrs.type.toLowerCase();
				var accordion= $compile("<accordion close-others='false'></accordion>")(scope);		
				element.append(accordion)
				
				scope.$watch('plugins', function (newValue) {
					var plugins = newValue || {};			
					var keys = $filter('orderBy')(Object.keys(plugins));
										
					
					//Remove the plugin if needeed
					accordion.children().toArray().forEach(function(e){
						if (keys.indexOf(e.getAttribute("heading")) < -1) {
							accordion.removeChild(e);
						}
					});
					
					//Add plugins
					keys.forEach(function(pluginKey) {
						var pluginKeyLower = pluginKey.toLowerCase();
					
						var ee = accordion.children().toArray().some(function(e){ return e.getAttribute('heading')==pluginKey; });
					
						if (ee == false) {
							var pluginDirective = type +"-plugin-" + pluginKeyLower;
							
							var body = '';
							var directiveName = type + "Plugin" + pluginKeyLower[0].toUpperCase() + pluginKeyLower.slice(1) + "Directive";
							if ($injector.has(directiveName)) {
								body = '<' + pluginDirective + ' plugin-data="plugins[\''+ pluginKey +'\']" id="\''+attrs.id+'\'"></' + pluginDirective + '>';
							}
							else {
								body = '<pre class="text-danger">' + $filter('json')(plugins[pluginKey], 4)  + ' </pre>'	
							}
							accordion.append($compile('<accordion-group heading="'+pluginKey+'">'+body+'</accordion-group>')(scope));
						}
					});	
				}, true);
			}
		}
	}]);
	
})();