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


	app.directive("videoEditMediaLive", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="
			},
			templateUrl: 'admin-plugin-contents/views/directives/video-edit-media-live.html'
		}
	});
	
	app.directive("videoEditMediaFiles", function(){
		return {
			restrict: 'E',
			scope: {
				video: "="
			},
			templateUrl: 'admin-plugin-contents/views/directives/video-edit-media-files.html',
			controller: ["$scope", '$modal', 
				function($scope, $modal) {
					$scope.uploadMasters = function() {
					
						var modalInstance = $modal.open({
							templateUrl: 'admin-plugin-contents/views/modal/video-edit-media-files-upload-masters.html',
							size: 'lg',
							backdrop: true,
							resolve: {
								video: function() {return $scope.video;}
							},
							controller: function ($scope, $modalInstance, video) {
								$scope.video = video;
								
								$scope.type = undefined;
								$scope.video.source.masters.files.some(function(f){
									if (f.tag){
										var s = f.tag.split('/')
										if ($scope.type == undefined) {
											$scope.type = s[1]
										}
										else {
											if (s[1] != type){
												$scope.type = undefined
												return true;
											}
										}
									}
								});						
					
								$scope.changeType = function() {
									console.log("change");
								}				
					
								console.log($scope.type);								
								
								
								$scope.cancel = function () {
									$modalInstance.dismiss();
								};
								$scope.accept = function () {
									$modalInstance.dismiss();
								};
							}
						});					
					
					}
				}
			]			
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
	

	app.directive("videoEditTasks", function(){
		return {
			restrict: 'E',
			scope: {
				videoId: "="
			},
			templateUrl: 'admin-plugin-contents/views/directives/video-edit-tasks.html',
			controller: ["$scope", "$base64", "TaskCRUD",
			function($scope, $base64, TaskCRUD) {
			
				$scope.$watch('videoId', function(){
					$scope.loadingTasks = true;
					if ($scope.videoId != null) {				
						var final_query = {targetId: $scope.videoId};
						$scope.filterQuery = $base64.encode(JSON.stringify(final_query));
			
						TaskCRUD.query({limit:100, skip:0, filters:$scope.filterQuery})
						.$promise.then(function(data){
							$scope.tasks = data;
							$scope.loadingTasks = false
		//					$scope.timeoutReload = null;
						});
					}
				});
			}]
		}
	});

	
	app.directive("videoEditParentsChannels", function(){
		return {
			restrict: 'E',
			scope: {
				videoId: "=",
				parentChannels: "=channels"
			},
			templateUrl: 'admin-plugin-contents/views/directives/video-edit-parents-channels.html',
									
			
			controller: ["$scope", "$modal", "$base64", "$timeout", "ChannelCRUD", "Filters", "AdminState", "MessageBox", 'VideoCRUD', 
			function($scope, $modal, $base64, $timeout, ChannelCRUD, Filters, AdminState, MessageBox, VideoCRUD) {
				$scope.loadingParentChannels = true;
				$scope.detailView = false;

				$scope.state=AdminState;		
				$scope.currentPage=1;
				$scope.filterQuery = null;
				$scope.selectableFilters = Filters.$get("channel");		
				$scope.timeoutReload = null;
				$scope.timeoutSearchText = null;	
				
				$scope.$watch('state.channelFilters', function(){ 
					if ($scope.state.channelFilters) {
						var final_query = Filters.makeQuery($scope.state.channelFilters.filters || [], $scope.state.channelFilters.searchText);
						$scope.filterQuery = $base64.encode(JSON.stringify(final_query));
						$scope.reloadChannels();
					}
				}, true );
			
				$scope.$watch('currentPage', function(){ $scope.reloadChannels(); });
				
				$scope.reloadChannels = function(){
					if ($scope.timeoutReload) {
						$timeout.cancel($scope.timeoutReload);
					}		
					$scope.loadingChannels = true;
					$scope.timeoutReload = $timeout(function() {			
						ChannelCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
						.$promise.then(function(data){
							$scope.channels = data;
							$scope.loadingChannels = false
							$scope.timeoutReload = null;
						});
					}, 500);
				};				
				
				
				$scope.$watch('videoId', function(){
					if ($scope.videoId) {				
						$scope.loadingChannels = true;
						VideoCRUD.parents({id: $scope.videoId}).$promise
						.then(function(channels){
							$scope.parentChannels = channels.list;
							$scope.loadingParentChannels = false;
						});
					}
					else {
						$scope.parentChannels = [];
						$scope.loadingParentChannels = false;						
					}
				});
				
				$scope.existsChannelInChannel = function(c) {
					return $scope.parentChannels.some(function(e,i){ return (e._id == c._id);});
				}
				
				$scope.addChannel = function(c) {
					$scope.parentChannels.push(c);
				}
				$scope.removeChannel = function(c) {
					var idx = -1;
					$scope.parentChannels.some(function(e,i){
						if (e._id == c._id) {
							idx = i;
							return true;
						}
					});
					if (idx >= 0) {
						$scope.parentChannels.splice(idx,1);
					}
				}
			}]
		}
	});	
	
})();