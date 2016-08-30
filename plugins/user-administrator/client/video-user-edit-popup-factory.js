(function() {
	var app = angular.module('userAdminModule');


	app.directive("videoUserEditSubjects", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="	
			},
			templateUrl: 'user-administrator/views/directives/video-user-edit-subjects.html',
			controller: ['$scope', function($scope) {
				if (!$scope.video.pluginData) {$scope.video.pluginData = {}};
				if (!$scope.video.pluginData.sakai) {$scope.video.pluginData.sakai = {codes:[]}};
				
				$scope.codes = [];
				$scope.video.pluginData.sakai.codes.forEach(function(c){
					var r = {code: c, description: ""};
					$scope.codes.push(r);
				});
				
				
				
				$scope.removeSubject = function(code) {
					
				};
				
				$scope.addSubject = function() {
					
				}
			}]
		}
	});	

	app.directive("videoUserEditTranslectures", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="	
			},
			templateUrl: 'user-administrator/views/directives/video-user-edit-translectures.html',
			controller: ['$scope', 'TranslecturesRest', function($scope, TranslecturesRest) {
						
				$scope.loading = true;
				
				
				TranslecturesRest.status({id:$scope.video._id}).$promise
				.then(function(status){
					$scope.status = status;
					return TranslecturesRest.langs({id:$scope.video._id}).$promise;
				})
				.then(function(langs){
					$scope.langs = langs;
				})
				.catch(function(){
					$scope.status = {status:"error", description:""};
					$scope.langs=[];
				})
				.finally(function(){
					$scope.loading = false;
				})
			}]
		}
	});	

	app.controller('VideoUserEditModalController', [ "$scope", "$modalInstance", "videoData",
		function($scope, $modalInstance, videoData) {
			$scope.video = videoData;
						
			
			$scope.close = function() {
				$modalInstance.dismiss();
			};
			
			$scope.accept = function() {			
				$modalInstance.close({
					videoData: $scope.video
				});
			};
		}
	]);

	app.factory('VideoUserEditPopup', ['$modal',function($modal) {
		return function(videoData) {
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl:'user-administrator/views/modal/video-user-edit.html',
				controller:'VideoUserEditModalController',	
				resolve:{
					videoData: function() {
						return videoData;
					}
				}							
			});

			return modalInstance.result.then(function(result) {return result.videoData;});
		};
	}]);
	
})();