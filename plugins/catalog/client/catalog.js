(function() {
	var catalogModule = angular.module('catalogModule',["ngRoute","ngResource","ui.bootstrap"]);

	var CatalogController = function($scope,Channel) {
		$scope.channels = [];
		$scope.videos = [];

		var limit = 10;
		
		$scope.searchText = "";
		
		// Pestañas vídeos/canales
		$scope.currentTab = 0;
		
		$scope.showChannels = function() {
			$scope.currentTab = 0;
		};
		
		$scope.showVideos = function() {
			$scope.currentTab = 1;
		};
		
		$scope.channelTabSelected = function() {
			return $scope.currentTab == 0;
		};
		
		$scope.videoTabSelected = function() {
			return $scope.currentTab == 1;
		};
		
		
		
		
		// Pagination
		$scope.totalItems = 10;
		$scope.currentPage = 1;
		
		$scope.pageChanged = function() {
			console.log("Page changed: " + $scope.currentPage);
		};

		$scope.doSearch = function() {
			Channel.query({search:$scope.searchText}).$promise
				.then(function(result) {
					$scope.channels = result.channels;
					$scope.videos = result.videos;
				});
		}
		
		$scope.ownerName = function(channel) {
			var contactData = channel.owner.length ? channel.owner[0].contactData:{};
			return contactData ? contactData.name + " " + contactData.lastName:"anonymous";
		};

		$scope.thumbnail = function(channel) {
			return channel.thumbnail || 'resources/images/channel-placeholder.gif';
		};
		
		$scope.doSearch();
	};

	CatalogController.$inject = ["$scope","Channel"];
	catalogModule.controller('CatalogController',CatalogController);

	catalogModule.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/catalog',{
				templateUrl: 'catalog/views/main.html',
				controller: "CatalogController"
			});
	}]);
})();

