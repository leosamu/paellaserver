(function() {
	var catalogModule = angular.module('catalogModule',["ngRoute","ngResource","ui.bootstrap"]);

	var CatalogController = function($scope,$routeParams,Channel,Video) {
		$scope.channels = [];
		$scope.videos = [];

		$scope.searchText = decodeURI($routeParams.search || "");
		$scope.channelId = $scope.searchText=="" ? $routeParams.id:null;
		
		// Pestañas vídeos/canales
		$scope.currentTab = -1;

		$scope.loadChannelParents = function(id) {
			Channel.parents({id:id}).$promise
				.then(function(result) {
					$scope.parents = result.list;
				});
			$scope.parents = [];
		};

		$scope.loadVideoParents = function(id) {
			Video.parents({id:id}).$promise
				.then(function(result) {
					$scope.parents = result.list;
				});
			$scope.parents = [];
		};
		
		$scope.showChannels = function() {
			if ($scope.numChannels()>0) {
				$scope.currentTab = 0;
				return true;
			}
			return false;
		};
		
		$scope.showVideos = function() {
			if ($scope.numVideos()>0) {
				$scope.currentTab = 1;
				return true;
			}
			return false;
		};

		$scope.showAny = function() {
			$scope.currentTab = -1;
		};
		
		$scope.channelTabSelected = function() {
			return $scope.currentTab == 0;
		};
		
		$scope.videoTabSelected = function() {
			return $scope.currentTab == 1;
		};

		$scope.anyTabSelected = function() {
			return $scope.currentTab = -1;
		};

		$scope.numVideos = function() {
			return $scope.videos.length;
		};

		$scope.numChannels = function() {
			return $scope.channels.length;
		};

		$scope.selectDefaultTab = function() {
			if (!$scope.showVideos() && !$scope.showChannels()) {
				$scope.showAny();
			}
		};

		// Pagination
		$scope.totalItems = 10;
		$scope.currentPage = 1;
		
		$scope.pageChanged = function() {
			console.log("Page changed: " + $scope.currentPage);
		};

		$scope.navigateChannel = function(channel) {
			location.href = "#/catalog/channel/" + channel._id;
		};

		$scope.openVideo = function(video) {
			window.open("player/?id=" + video._id + "&autoplay=true");
		};

		$scope.doSearch = function() {
			if ($scope.searchText && $scope.searchText!="") {
				location.href = "#/catalog/search/" + encodeURI($scope.searchText);
			}
			else if (!$scope.channelId) {
				location.href = "#/catalog";
			}

			if (!$scope.channelId) {
				Channel.query({search:$scope.searchText}).$promise
					.then(function(result) {
						$scope.channelData = {
							title: null,
							owner: null
						};
						$scope.channels = result.channels;
						$scope.videos = result.videos;
						$scope.selectDefaultTab();
					});
			}
			else {
				Channel.all({id:$scope.channelId}).$promise
					.then(function(result) {
						$scope.channelData = {
							title: result.title,
							owner: result.owner
						};
						$scope.channels = result.children;
						$scope.videos = result.videos;
						$scope.selectDefaultTab();
						document.title = result.title;
					});
			}
		};
		
		$scope.ownerName = function(channel) {
			var contactData = channel.owner.length ? channel.owner[0].contactData:{};
			return contactData ? contactData.name + " " + contactData.lastName:"anonymous";
		};

		$scope.thumbnail = function(item) {
			return item.thumbnail || (item.source ? 'resources/images/video-placeholder.jpg':'resources/images/channel-placeholder.gif');
		};
		
		$scope.doSearch();
	};

	CatalogController.$inject = ["$scope","$routeParams","Channel","Video"];
	catalogModule.controller('CatalogController',CatalogController);

	catalogModule.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/catalog',{
				templateUrl: 'catalog/views/main.html',
				controller: "CatalogController"
			}).

			when('/catalog/search/:search', {
				templateUrl: 'catalog/views/main.html',
				controller: 'CatalogController'
			}).

			when('/catalog/channel/:id', {
				templateUrl: 'catalog/views/main.html',
				controller: 'CatalogController'
			});
	}]);
})();

