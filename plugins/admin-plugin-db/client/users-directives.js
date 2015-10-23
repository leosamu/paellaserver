(function() {
	var app = angular.module('adminPluginDB');

		
	app.directive("adminUserEditorAutentication", ['$compile', '$injector', '$filter',  function($compile, $injector, $filter){
		return {
			restrict: 'E',
			scope: {
				user: "="
			},
			link: function(scope, element, attrs, ctrl) {			
				var accordion= $compile("<accordion close-others='false'></accordion>")(scope);		
				element.append(accordion)
				scope.$watch('user.auth', function () {
					var auth = scope.user.auth || {};			
					var keys = $filter('orderBy')(Object.keys(auth));
										
					
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
							var pluginDirective = pluginKey.toLowerCase() + "-user-auth";
							
							var body = '';
							if ($injector.has(pluginKey.toLowerCase()+"UserAuthDirective")) {
								body = '<' + pluginDirective + ' auth-data="user.auth[\''+ pluginKey +'\']" user-id="\''+scope.user._id+'\'"></' + pluginDirective + '>';
							}
							else {
								body = '<pre class="text-danger">' + $filter('json')(auth[pluginKey], 4)  + ' </pre>'	
							}
							
							accordion.append($compile('<accordion-group heading="'+pluginKey+'">'+body+'</accordion-group>')(scope));
						}
					});	
				}, true);
			}
		};
	}]);	
	
	
	app.directive('polimediaUserAuth', function(){
		return {
			restrict: 'E',
			scope: {
				authData: "=",
				userId: "="
			},		
			templateUrl: 'admin-plugin-db/views/directives/user-auth-polimedia.html'
		};
	});	
	
	app.directive('upvUserAuth', function(){
		return {
			restrict: 'E',
			scope: {
				authData: "=",
				userId: "="
			},		
			templateUrl: 'admin-plugin-db/views/directives/user-auth-upv.html'
		};
	});		
	
	
})();