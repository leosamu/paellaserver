(function() {
	var plugin = angular.module('adminPluginTranslectures');

		
	plugin.controller("AdminTranslecturesEditController", ["$scope", "$routeParams", "$window", "TranslecturesCRUD", "MessageBox",  function($scope, $routeParams, $window, TranslecturesCRUD, MessageBox) {
		$scope.updating = false;
		$scope.tl = TranslecturesCRUD.get({id: $routeParams.id});
		
		
				
		$scope.updateServer = function() {
			$scope.updating = true;
			TranslecturesCRUD.update($scope.tl).$promise
			.then(
				function() {
					if ($window.history.length > 1) {
						$window.history.back();
					}
					else {
						return MessageBox("Servidor actualizado", "El servidor de translectures se ha actualizado correctamente.");
					}
				},
				function() {
					return MessageBox("Error", "Ha ocurrido un error al actualizar el servidor de translectures.");
				}
			).finally(function(){
				$scope.updating = false;
			});
		};			
		
	}])	
		
	
	
})();