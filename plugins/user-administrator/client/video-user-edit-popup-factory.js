(function() {
	var app = angular.module('userAdminModule');


	app.directive("videoUserEditTranslectures", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="	
			},
			templateUrl: 'user-administrator/views/directives/video-user-edit-translectures.html',
			controller: ['$scope', function($scope) {
				$scope.status = {status:"error", description:"oo"};
				$scope.langs=[];					
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