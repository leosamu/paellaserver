(function() {
	var catalogModule = angular.module('catalogModule');
	
	
	catalogModule.directive('errSrc', function() {
		return {
			link: function(scope, element, attrs) {
				element.bind('error', function() {
					if (attrs.src != attrs.errSrc) {
						attrs.$set('src', attrs.errSrc);
					}
				});
			}
		}	
	});
	
})();

