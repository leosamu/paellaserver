(function() {
	var app = angular.module('adminPluginVideos');

	app.directive('languageSelect', function(){
		return {
			restrict: 'E',
			scope: {
				language: "="	
			},
			controller: ['$scope', function($scope){
				$scope.langs= [
					{ "id":"es", "name":"es" },
					{ "id":"en", "name":"en" },
					{ "id":"it", "name":"it" },
					{ "id":"fr", "name":"fr" },
					{ "id":"pt", "name":"pt" },
					{ "id":"de", "name":"de" },
					{ "id":"ca", "name":"ca" },
					{ "id":"af", "name":"af" },
					{ "id":"lt", "name":"lt" },
					{ "id":"nl", "name":"nl" },
					{ "id":"da", "name":"da" },
					{ "id":"hu", "name":"hu" },
					{ "id":"ja", "name":"ja" },
					{ "id":"ru", "name":"ru" },
					{ "id":"cs", "name":"cs" },
					{ "id":"no", "name":"no" },
					{ "id":"fi", "name":"fi" },
					{ "id":"kk", "name":"kk" },
					{ "id":"ar", "name":"ar" }
				];

			}],
			templateUrl: 'admin-plugin-contents/views/directives/language-select.html'
		};
	});

	
	app.directive('ownersSelectOrCreate', function(){
		return {
			restrict: 'E',
			scope: {
				owners: "="	
			},
			controller: ['$scope', '$modal', function($scope, $modal) {
				$scope.changeOwner = function() {
				
					var modalInstance = $modal.open({
						templateUrl: 'admin-plugin-contents/views/modal/select-owner.html',
						size: '',
						backdrop: 'static',
						keyboard: false,
						resolve: {
							owners: function() {
								return $scope.owners;
							}
						},
						controller: ["$scope", "$modalInstance", "owners", "UserCRUD", function ($scope, $modalInstance, owners, UserCRUD) {
							$scope.cancel = function () {
								$modalInstance.dismiss();
							};						
							$scope.accept = function () {
								if ($scope.ownerId == null){
									var user = {
										contactData: {
											name: $scope.ownerName,
											lastName: $scope.ownerLastName,
											email: $scope.ownerEmail
										}										
									};

									UserCRUD.save(user).$promise.then(
										function(user) {
											$modalInstance.close([user]);
										},
										function(){
											$modalInstance.dismiss();											
										}
									);
								}
								else {							
									var ret =[{
										_id: $scope.ownerId,
										contactData: {
											name: $scope.ownerName,
											lastName: $scope.ownerLastName,
											email: $scope.ownerEmail
										}
									}];
									$modalInstance.close(ret);
								}
							};
						}]
					});
					
					modalInstance.result.then(function (owners) {
						$scope.owners = owners;
					});
				};
			}],
			templateUrl: 'admin-plugin-contents/views/directives/owners-select-or-create.html'
		};
	});

	app.directive("videoEditBasic", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="	
			},
			controller: ['$scope', function($scope) {
				$scope.$watch('video.published', function(){
					
					if ($scope.video && $scope.video.published) {
						if ($scope.video.published.status == true) {
							$scope.videoPublishedStatus = "published";
						}
						else {
							if ($scope.video.published.publicationDate == undefined) {
								$scope.videoPublishedStatus = "unpublished";
							}
							else {
								if ($scope.video.published.publicationDate > new Date()) {
									$scope.videoPublishedStatus = "futurePublished";
								}
								else {
									$scope.videoPublishedStatus = "published";								
								}
							}
						}
					}
				}, true);
				
			}],
			templateUrl: 'admin-plugin-contents/views/directives/video-edit-basic.html'
		}
	});
	
	
	app.directive("videoEditAdvanced", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="	
			},
			templateUrl: 'admin-plugin-contents/views/directives/video-edit-advanced.html'
		}
	});
		
	app.directive("videoEditVideos", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="
			},
			templateUrl: 'admin-plugin-contents/views/directives/video-edit-videos.html'
		}
	});

	app.directive("videoEditVideoInfo", function(){
		return {
			restrict: 'E',
			scope: {
				videoInfo: "=",
				repository: "=",
				videoId: "=" 
			},
			templateUrl: 'admin-plugin-contents/views/directives/video-edit-video-info.html'
		}
	});
	
	
	app.directive("videoEditParentsChannels", function(){
		return {
			restrict: 'E',
			scope: {
				videoId: "="
			},
			templateUrl: 'admin-plugin-contents/views/directives/video-edit-parents-channels.html',
			controller: ['$scope', 'VideoCRUD', function($scope, VideoCRUD) {
				$scope.loadingChannels = true;
				$scope.$watch('videoId', function(){
					if ($scope.videoId) {				
						$scope.loadingChannels = true;
						VideoCRUD.parents({id: $scope.videoId}).$promise
						.then(function(channels){
							$scope.channels = channels;
							$scope.loadingChannels = false;
						});
					}
				});
			}]
		}
	});	
	
})();