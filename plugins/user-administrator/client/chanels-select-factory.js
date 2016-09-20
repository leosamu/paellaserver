(function() {
	var app = angular.module('userAdminModule');


	app.controller("ChannelsSelectController", ['$scope', '$http', '$timeout', '$cookies', '$modal', "$modalInstance", "$sce", "Video", "Channel", "onlyYourVideos",
	function($scope, $http, $timeout, $cookies, $modal, $modalInstance, $sce, Video, Channel, onlyYourVideos) {	
						
		$scope.onlyYourVideos = onlyYourVideos;
		
		$scope.$watch('tab', function() {
			$scope.channelURL = null;
			$scope.selectedChannels = [];
			$scope.searchChannelText = null;
			$scope.resultChannels = [];
		});
		
		
		$scope.$watch('channelURL', function(){
			$scope.embedChannel = null;
			
			if ($scope.channelURL != null) {
				var urlparser = document.createElement('a');
				$scope.parser = urlparser;
				urlparser.href = $scope.channelURL;
													
				if ((urlparser.host == "media.upv.es") && (urlparser.pathname == "/")) {				
					var rx = /#\/catalog\/channel\/(.+)/;
					var arr = rx.exec(urlparser.hash);
					var id = arr[1];
					
					if (id != null) {
						Channel.get({id: id}).$promise.then(function(channel){
							$scope.embedChannel = channel;
							$scope.selectedChannels = [channel];						
						});					
					}
				}
			}		
		});		
		
		$scope.$watch('itemsPerPage', function(value){
			$cookies.put('itemsPerPage', value);
		});
		$scope.$watch('currentPage', function(){ $scope.reloadChannels(); });

		$scope.reloadChannels = function(){
			$scope.loadingVideos = true;
			$http.get('/rest/plugins/user-administrator/channels?limit='+$scope.itemsPerPage+'&skip='+($scope.currentPage-1)*$scope.itemsPerPage)
			.then(
				function successCallback(response) {
					$scope.yourChannels = response.data;
					$scope.loadingVideos = false
				},
				function errorCallback(response) {
					$scope.loadingVideos = false
				}
			);	
		};
		$scope.currentPage=1;
		$scope.itemsPerPage = $cookies.get('itemsPerPage') || '10';
		$scope.reloadChannels();		
		
		
		$scope.searchChannels = function() {
			Channel.search({search:$scope.searchVideoText}).$promise.then(function(results){
				$scope.resultChannels = results.channels;
			});
		}
		
		$scope.switchSelectChannel = function(c) {
			c.selected = !(c.selected==true);
			
			if (c.selected) {
				$scope.selectedChannels.push(c);
			}
			else {
				var index = $scope.selectedChannels.indexOf(c);
				if (index > -1) {
				    $scope.selectedChannels.splice(index, 1);
				}
			}
		}		
		
		$scope.close = function() {
			$modalInstance.dismiss();
		}
		
		$scope.accept = function() {
			$modalInstance.close($scope.selectedChannels);
		}
		
	}]);
	
	
	app.factory('ChannelsSelect', ['$modal',function($modal) {
		return function(onlyYourVideos) {
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl:'user-administrator/views/modal/channels-select.html',
				controller:'ChannelsSelectController',
				resolve: {
					onlyYourVideos: function () {
						return (onlyYourVideos==true);
					}
				}
			});

			return modalInstance.result;
		};
	}]);	
	
})();