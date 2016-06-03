(function() {
	var app = angular.module('userAdminModule');


	app.controller("VideosSelectController", ['$scope', '$http', '$timeout', '$cookies', '$modal', "$modalInstance", "$sce", "Video", "Channel",
	function($scope, $http, $timeout, $cookies, $modal, $modalInstance, $sce, Video, Channel) {	
		
		$scope.$watch('tab', function() {
			$scope.videoURL = null;
			$scope.selectedvideos = [];
			$scope.searchVideoText = null;
			$scope.resultVideos = [];
		});
		
		$scope.$watch('videoURL', function(){
			$scope.embedUrl = null;
			
			if ($scope.videoURL != null) {
				var urlparser = document.createElement('a');
				$scope.parser = urlparser;
				urlparser.href = $scope.videoURL;
								
				if ((urlparser.host == "media.upv.es") && (urlparser.pathname == "/player/")) {
					var query = urlparser.search.substr(1);
					var result = {};
					if (query != "") {
						query.split("&").forEach(function(part) {
							var item = part.split("=");
							result[item[0]] = decodeURIComponent(item[1]);
						});
					}
	
					if (result.id != null) {
						Video.get({id: result.id}).$promise.then(function(video){
							$scope.embedUrl = $sce.trustAsResourceUrl("https://media.upv.es/player/?id=" + result.id);	
							$scope.selectedvideos = [video];						
						});					
					}
				}
			}		
		});		
		
		$scope.$watch('itemsPerPage', function(value){
			$cookies.put('itemsPerPage', value);
		});
		$scope.$watch('currentPage', function(){ $scope.reloadVideos(); });

		$scope.reloadVideos = function(){
			$scope.loadingVideos = true;
			$http.get('/rest/plugins/user-administrator/videos?limit='+$scope.itemsPerPage+'&skip='+($scope.currentPage-1)*$scope.itemsPerPage)
			.then(
				function successCallback(response) {
					$scope.yourVideos = response.data;
					$scope.loadingVideos = false
				},
				function errorCallback(response) {
					$scope.loadingVideos = false
				}
			);	
		};
		
		$scope.currentPage=1;
		$scope.itemsPerPage = $cookies.get('itemsPerPage') || '10';
		$scope.reloadVideos();		
		
		
		$scope.searchVideos = function() {
			Channel.search({search:$scope.searchVideoText}).$promise.then(function(results){
				$scope.resultVideos = results.videos;
			});
		}
		
		$scope.switchSelectVideo = function(v) {
			v.selected = !(v.selected==true);
			
			if (v.selected) {
				$scope.selectedvideos.push(v);
			}
			else {
				var index = $scope.selectedvideos.indexOf(v);
				if (index > -1) {
				    $scope.selectedvideos.splice(index, 1);
				}
			}
		}
		
		
		$scope.close = function() {
			$modalInstance.dismiss();
		}
		
		$scope.accept = function() {
			$modalInstance.close($scope.selectedvideos);
		}
		
	}]);
	
	
	app.factory('VideosSelect', ['$modal',function($modal) {
		return function() {
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl:'user-administrator/views/modal/videos-select.html',
				controller:'VideosSelectController',	
				resolve:{
				}							
			});

			return modalInstance.result;
		};
	}]);	
	
})();