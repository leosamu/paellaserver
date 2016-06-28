(function() {
	var app = angular.module('adminPluginTranslectures');
	
	
	app.directive('videoPluginTranslectures', function(){
		return {
			restrict: 'E',
			scope: {
				pluginData: "=",
				videoId: "=id"
			},		
			templateUrl: 'admin-plugin-translectures/views/directives/video-plugin-translectures.html',
			controller: ['$scope', '$http', 'TranslecturesCRUD', function($scope, $http, TranslecturesCRUD) {
				$scope.tlServer = TranslecturesCRUD.get({id: $scope.pluginData.server});					

				$http.get("/rest/plugins/admin-plugin-translectures/langs/" + $scope.videoId)
				.then(function(res){ $scope.langs = res.data; });

				$http.get("/rest/plugins/admin-plugin-translectures/status/" + $scope.videoId)
				.then(function(res){ $scope.status = res.data; });
			}]
		};
	});
	
})();