(function() {

	var plugin = angular.module('paellaserver');	

	plugin.factory('runInSequence', ['$q', function ($q) {
				
		return function runInSequence(arr, doSomethingAsync) {
			return arr.reduce(function (promise, item) {	
				return promise.then(function(result) {        
					var p = doSomethingAsync(item);			
					function next(v) {
						return result.concat(p);	        
					}
					return $q.when(p).then(next, next);
				});
			}, $q.when([]));
		}
	}]);	
	
})();