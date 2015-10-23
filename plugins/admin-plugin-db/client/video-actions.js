(function() {
	var app = angular.module('adminPluginDB');
	
	
	app.run(['Actions', '$q', function(Actions, $q) {

		Actions.registerAction(
			{
				context: "video",			
				label: "Recodificar videos",
				runAction: function(v) {
					var ms = Math.floor((Math.random() * 10000) + 1);
				
					var deferred = $q.defer();

					setTimeout(function() {
						console.log("TODO: Recodificar video " + v._id);
						deferred.resolve("");
					}, ms);
					
					return deferred.promise;
				}
			}
		);


		Actions.registerAction(
			{
				context: "video",			
				label: "Enviar a transLectures",
				runAction: function(v) {
					var ms = Math.floor((Math.random() * 10000) + 1);
				
					var deferred = $q.defer();

					setTimeout(function() {
						console.log("TODO: translectures video " + v._id);
						deferred.resolve("");
					}, ms);
					
					return deferred.promise;
				}
			}
		);


		Actions.registerAction(
			{
				context: "video",			
				label: "Subir a YouYube",
				runAction: function(v) {
					var ms = Math.floor((Math.random() * 10000) + 1);
				
					var deferred = $q.defer();
					

					setTimeout(function() {
						console.log("TODO: Youtube video " + v._id);
						deferred.resolve("");
					}, ms);
					
					return deferred.promise;
				}
			}
		);
		
		Actions.registerAction(
			{
				context: "video",			
				label: "Enviar correo al profesor",
				runAction: function(v) {
					var ms = Math.floor((Math.random() * 10000) + 1);
				
					var deferred = $q.defer();
					

					setTimeout(function() {
						console.log("TODO: Correo " + v._id);
						deferred.resolve("");
					}, ms);
					
					return deferred.promise;
				}
			}
		);		
				
	}]);	
})();