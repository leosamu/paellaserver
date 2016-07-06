(function() {
	var plugin = angular.module('adminPluginTranslectures');

		
	plugin.controller("AdminTranslecturesNewController", ["$scope", "$window", "TranslecturesCRUD", "MessageBox",  function($scope, $window, TranslecturesCRUD, MessageBox) {
		$scope.updating = false;
		$scope.tl = {}
		
		
				
		$scope.createServer = function() {
			$scope.updating = true;
			TranslecturesCRUD.save($scope.tl).$promise
			.then(
				function() {
					if ($window.history.length > 1) {
						$window.history.back();
					}
					else {
						return MessageBox("Servidor actualizado", "El servidor de translectures se ha creado correctamente.");
					}
				},
				function() {
					return MessageBox("Error", "Ha ocurrido un error al crear el servidor de translectures.");
				}
			).finally(function(){
				$scope.updating = false;
			});
		};			
	
	}])	
		
	
	
})();