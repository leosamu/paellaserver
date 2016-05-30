(function() {
	var app = angular.module('userAdminModule');


	app.controller("UserAdminEditChannelController", ['$scope', "$routeParams", '$http', '$timeout', '$cookies', '$modal', '$window', 'User', 'Channel', 'ChannelEditPopup', 'MessageBox', 'VideosSelect',
	function($scope, $routeParams, $http, $timeout, $cookies, $modal, $window, User, Channel, ChannelEditPopup, MessageBox, VideosSelect) {
	
		User.current().$promise
		.then(function(data) {
			if (data._id=="0") {
				location.href = "#/auth/login";
			}
		});				

		$scope.newChannel = function() {
			ChannelEditPopup(null)
			.then(function(channelData) {
				return Channel.create(channelData).$promise;
			})					
			.then(function(channel) {
				location.reload();
			});
		};
				
				
		$scope.loading = true;
		$scope.errorLoading = false;
		$http.get('/rest/plugins/user-administrator/channels/' + $routeParams.id)
		.then(
			function successCallback(response) {
				$scope.channel = response.data;
				$scope.loading = false;
				
				$scope.visibility = ($scope.channel.hidden == false)  ?'public' : 'hidden';
				$scope.$watch('visibility', function(){
					$scope.channel.hidden = ($scope.visibility != 'public');
					$scope.channel.hiddenInSearches = ($scope.visibility != 'public');
				})		
				
			},
			function errorCallback(response) {
				$scope.loading = false;
				$scope.errorLoading = true;
			}
		);
		
		
		$scope.updateChannel = function() {

			$http.put('/rest/plugins/user-administrator/channels/' + $routeParams.id, $scope.channel)
			.then(
				function successCallback(response) {
					MessageBox("Chanel updated", "Channel updated correctly").then(function(){
						if ($window.history.length > 1) {
							$window.history.back();
						}
					})					
				},
				function errorCallback(response) {
					MessageBox("Error", "An error has happened updating the channel.");					
				}
			);			
		}
		
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
		
		$scope.getVideoThumbnail = function(v) {
			try {
				if (v.thumbnail) {
					if  (v.thumbnail.startsWith("http")) {
						return v.thumbnail;
					}
					else {			
						return v.repository.server + v.repository.endpoint + v._id +"/" + v.thumbnail;
					}
				}
			}
			catch(err) {}			
			return "resources/images/video-placeholder.png";
		};
		
		$scope.addVideos = function() {
			VideosSelect().then(function(selectedVideos) {
				selectedVideos.forEach(function(v) {				
					$scope.channel.videos.push(v);	
				});
			});
		}
	}]);		
	
})();