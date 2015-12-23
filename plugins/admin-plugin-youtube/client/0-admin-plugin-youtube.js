(function() {
	var plugin = angular.module('adminPluginYoutube',['AuthorizationRoutesModule']);
	
	
	angular.module('adminPluginsModule').registerPlugin(plugin);
})();