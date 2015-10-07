(function() {
	var app = angular.module('adminModule');
	
	
	app.run(['VideoActions', '$q', function(VideoActionsProvider, $q) {
		VideoActionsProvider.registerAction(
			{
				label: "Recodificar videos",
				doAction: function(v) {
					var ms = Math.floor((Math.random() * 10000) + 1);
				
					var deferred = $q.defer();
					console.log("TODO: Recodificar video " + v._id);

					setTimeout(function() {
						deferred.resolve("");
					}, ms);
					
					return deferred.promise;
				}
			}
		);


		VideoActionsProvider.registerAction(
			{
				label: "Enviar a transLectures",
				doAction: function(v) {
					var ms = Math.floor((Math.random() * 10000) + 1);
				
					var deferred = $q.defer();
					console.log("TODO: translectures video " + v._id);

					setTimeout(function() {
						deferred.resolve("");
					}, ms);
					
					return deferred.promise;
				}
			}
		);


		VideoActionsProvider.registerAction(
			{
				label: "Subir a YouYube",
				doAction: function(v) {
					var ms = Math.floor((Math.random() * 10000) + 1);
				
					var deferred = $q.defer();
					console.log("TODO: Youtube video " + v._id);

					setTimeout(function() {
						deferred.resolve("");
					}, ms);
					
					return deferred.promise;
				}
			}
		);
		
		VideoActionsProvider.registerAction(
			{
				label: "Enviar correo al profesor",
				doAction: function(v) {
					var ms = Math.floor((Math.random() * 10000) + 1);
				
					var deferred = $q.defer();
					console.log("TODO: Correo " + v._id);

					setTimeout(function() {
						deferred.resolve("");
					}, ms);
					
					return deferred.promise;
				}
			}
		);		
				
	}]);	
})();