(function() {
	var app = angular.module('adminPluginVideos');
	

	app.directive("channelEditBasic", function(){
		return {
			restrict: 'E',
			scope: {
				channel: "="
			},
			templateUrl: 'admin-plugin-videos/views/directives/channel-edit-basic.html'
		};
	});

	app.directive("channelEditAdvanced", function(){
		return {
			restrict: 'E',
			scope: {
				channel: "="
			},
			controller: ['$scope', function($scope) {
			
				$scope.$watch('channel.videosQuery', function(query) {
					if (query == undefined) {
						$scope.channelType = "normal";
					}
					else {
						$scope.channelType = "dynamic";
						if (query.whereQuery != undefined) {
							$scope.findType = '$where';
						}
						else {							
							$scope.findType = 'query';
						}
					}
				}, true);

				$scope.$watch('findType', function(type) {
					if (type =='$where') {
						$scope.channel.videosQuery.objectQuery = undefined;
						$scope.channel.videosQuery.whereQuery = $scope.channel.videosQuery.whereQuery || "";
					}
					else if (type =='query') {
						$scope.channel.videosQuery.whereQuery = undefined;
						$scope.channel.videosQuery.objectQuery = $scope.channel.videosQuery.objectQuery || "";
					}					
				});


				$scope.$watch('channelType', function(type) {
					if (type == 'normal') {
						$scope.channel.videosQuery = undefined;
					}
					else if (type == 'dynamic') {
						if (!$scope.channel.videosQuery) {
							$scope.channel.videosQuery = {};
						}
					}
				});
			

				$scope.linkToSakai = function() {
					if (!$scope.channel.pluginData) {
						$scope.channel.pluginData = {};
					}
					$scope.channel.pluginData.sakai = {code: "XX_YY"};
					$scope.channel.videosQuery = {
						objectQuery: '{"pluginData.sakai.codes":"XX_YY"}'
					}
				}

			}],
			templateUrl: 'admin-plugin-videos/views/directives/channel-edit-advanced.html'
		};
	});


	app.directive("channelEditVideos", function(){	
		return {
			restrict: 'E',
			scope: {
				channel: "="
			},
			controller: ['$scope', '$timeout', '$base64', 'VideoCRUD', 'Filters', function($scope, $timeout, $base64, VideoCRUD, Filters) {
				$scope.addVideosMode = false;
				$scope.selectableFilters = Filters.$get('video');
				$scope.state = {itemsPerPage:10}
				
				
				$scope.$watch('state.videoFilters', function(){ 
					if ($scope.state.videoFilters) {
						var final_query = Filters.makeQuery($scope.state.videoFilters.filters || [], $scope.state.videoFilters.searchText);
						$scope.filterQuery = $base64.encode(JSON.stringify(final_query));
						$scope.reloadVideos();
					}
				}, true );

				$scope.$watch('currentPage', function(){ $scope.reloadVideos(); });

		
				$scope.reloadVideos = function(){
					if ($scope.timeoutReload) {
						$timeout.cancel($scope.timeoutReload);
					}		
					$scope.loadingVideos = true;
					$scope.timeoutReload = $timeout(function() {			
						VideoCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
						.$promise.then(function(data){
							$scope.videos = data;
							$scope.loadingVideos = false
							$scope.timeoutReload = null;
						});
					}, 500);
				};		
		
				
				$scope.existsVideoInChannel= function(v) {
					if ($scope.channel && $scope.channel.videos) {
						return $scope.channel.videos.some(function(i){ return i._id == v._id;});				
					}
					else {
						return false;
					}
				}
		
				$scope.addVideoToChannel = function(v) {
					if (!$scope.existsVideoInChannel(v)) {
						$scope.channel.videos.push(v);
					}
				};
				
				$scope.removeVideoFromChannel = function(v) {
					var index = -1;
					$scope.channel.videos.some(function(vv, ii){
						if (v._id == vv._id) {
							index = ii;
							return true;
						}
						return false;
					});

					if (index > -1) {
						$scope.channel.videos.splice(index, 1);
					}
				};
				
			}],
			templateUrl: 'admin-plugin-videos/views/directives/channel-edit-videos.html'
		};
	});

	
	
	app.directive("channelEditChannels", function(){	
		return {
			restrict: 'E',
			require: 'ngModel',
			scope: {
				channel: "="
			},
			controller: ['$scope', '$timeout', '$base64', 'ChannelCRUD', 'Filters', function($scope, $timeout, $base64, ChannelCRUD, Filters) {
				$scope.addChannelMode = false;
				$scope.selectableFilters = Filters.$get('channel');
				$scope.state = {itemsPerPage:10}
				
				
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
		
				
				$scope.existsChannelInChannel= function(v) {
					if ($scope.channel && $scope.channel.children) {
						return $scope.channel.children.some(function(i){ return i._id == v._id;});				
					}
					else {
						return false;
					}
				}
		
				$scope.addChannelToChannel = function(v) {
					if (!$scope.existsChannelInChannel(v)) {
						$scope.channel.children.push(v);
					}
				};
				
				$scope.removeChannelFromChannel = function(v) {
					var index = -1;
					$scope.channel.children.some(function(vv, ii){
						if (v._id == vv._id) {
							index = ii;
							return true;
						}
						return false;
					});

					if (index > -1) {
						$scope.channel.children.splice(index, 1);
					}
				};
				
			}],
			templateUrl: 'admin-plugin-videos/views/directives/channel-edit-channels.html'
		};
	});
	
	

				
})();