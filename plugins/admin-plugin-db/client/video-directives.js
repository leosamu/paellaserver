(function() {
	var app = angular.module('adminPluginDB');
	
	
	app.directive("adminVideoEditorPlugins", ['$compile', '$injector', '$filter',  function($compile, $injector, $filter){
		return {
			restrict: 'E',
			scope: {
				video: "="
			},
			link: function(scope, element, attrs, ctrl) {			
				var accordion= $compile("<accordion close-others='false'></accordion>")(scope);		
				element.append(accordion)
				scope.$watch('video.pluginData', function () {
					var plugins = scope.video.pluginData || {};			
					var keys = $filter('orderBy')(Object.keys(plugins));
										
					
					//Remove the plugin if needeed
					accordion.children().toArray().forEach(function(e){
						if (keys.indexOf(e.getAttribute("heading")) < -1) {
							accordion.removeChild(e);
						}
					});
					
					//Add plugins
					keys.forEach(function(pluginKey) {
						var ee = accordion.children().toArray().some(function(e){ return e.getAttribute('heading')==pluginKey; });
					
						if (ee == false) {
							var pluginDirective = pluginKey.toLowerCase() + "-video-plugin";
							
							var body = '';
							if ($injector.has(pluginKey.toLowerCase()+"VideoPluginDirective")) {
								body = '<' + pluginDirective + ' plugin-data="video.pluginData[\''+ pluginKey +'\']" video-id="\''+scope.video._id+'\'"></' + pluginDirective + '>';
							}
							else {
								body = '<pre class="text-danger">' + $filter('json')(plugins[pluginKey], 4)  + ' </pre>'	
							}
							
							accordion.append($compile('<accordion-group heading="'+pluginKey+'">'+body+'</accordion-group>')(scope));
						}
					});	
				}, true);
			}
		};
	}]);


	
})();