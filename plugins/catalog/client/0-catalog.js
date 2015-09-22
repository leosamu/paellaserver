(function() {
	var catalogModule = angular.module('catalogModule',["ngRoute","ngResource","ui.bootstrap"]);

	catalogModule.controller('CatalogController', ["$scope","$routeParams","Channel","Video","User","ChannelListPopup",function($scope,$routeParams,Channel,Video,User,ChannelListPopup) {
		$scope.channels = [];
		$scope.videos = [];
		$scope.myVideos = [];
		$scope.myChannels = [];
		$scope.parents = [];
		$scope.loading = true;
		$scope.isAdmin = false;
		$scope.currentUser = null;

		$scope.searchText = decodeURI($routeParams.search || "");
		$scope.channelId = $scope.searchText=="" ? $routeParams.id:null;
		$scope.totalVideos = 0;

		$scope.isEmbed = /embed/i.test(window.location.href);
		$scope.showIfNotEmbed = !$scope.isEmbed;

		function addSortingIndexes(collection) {
			collection.forEach(function(item,index) {
				item.defaultSortingIndex = index;
			});
		}

		// Pestañas vídeos/canales
		$scope.currentTab = -1;

		function loadChannelParents() {
			Channel.parents({id:$scope.channelId}).$promise
				.then(function(result) {
					$scope.parents = result.list;
				});
			$scope.parents = [];
		}

		$scope.showMyChannels = function() {
			ChannelListPopup($scope.myChannels, false, function(selected) {
				alert(selected._id);
			});
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

		$scope.showMyVideos = function() {
			if (!$scope.logged) {
				location.href = "#/auth/login"
			}
			else if ($scope.numMyVideos()>0) {
				$scope.currentTab = 2;
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

		$scope.myVideosTabSelected = function() {
			return $scope.currentTab == 2;
		};

		$scope.myChannelsTabSelected = function() {
			return $scope.currentTab == 3;
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

		$scope.numMyVideos = function() {
			return $scope.myVideos.length;
		};

		$scope.numMyChannels = function() {
			return $scope.myChannels.length;
		};

		$scope.selectDefaultTab = function() {
			if (!$scope.showVideos() && !$scope.showChannels()) {
				$scope.showAny();
			}
		};

		$scope.selectBestTab = function() {
			var videoScore = 0;
			var channelScore = 0;
			var itemsToCheck = 4;
			var re = new RegExp($scope.searchText,"i");

			$scope.videos.some(function(video,index) {
				videoScore += video.score;
				if (re.test(video.title)) {
					videoScore += 40;
				}
				return index==itemsToCheck;
			});

			$scope.channels.some(function(channel,index) {
				channelScore += channel.score;
				if (re.test(channel.title)) {
					channelScore += 40;
				}
				return index==itemsToCheck;
			});

			return videoScore>=channelScore ? $scope.showVideos():$scope.showChannels();
		};

		$scope.doSearch = function() {
			$scope.loading = true;
			if ($scope.searchText && $scope.searchText!="") {
				$scope.isSearch = true;
				location.href = "#/catalog/search/" + encodeURI($scope.searchText);
			}
			else if (!$scope.channelId) {
				$scope.isSearch = false;
				location.href = "#/catalog";
			}

			if (!$scope.channelId) {
				Channel.search({search:$scope.searchText}).$promise
					.then(function(result) {
						$scope.channelData = {
							title: null,
							owner: null,
							hidden: false,
							hiddenInSearches: false
						};
						$scope.channels = result.channels;
						$scope.videos = result.videos;
						$scope.selectBestTab();
						$scope.loading = false;
						addSortingIndexes($scope.channels);
						addSortingIndexes($scope.videos);
					});
			}
			else {
				Channel.all({id:$scope.channelId}).$promise
					.then(function(result) {
						$scope.channelData = result || {};
						$scope.channelData.id = $scope.channelData._id;
/*						$scope.channelData = {
							id:$scope.channelId,
							title: result.title,
							owner: result.owner,
							hidden: result.hidden,
							hiddenInSearches: result.hiddenInSearches
						};
						*/
						$scope.channels = result.children;
						$scope.videos = result.videos;
						$scope.selectDefaultTab();
						document.title = result.title;
						$scope.loading = false;
						addSortingIndexes($scope.channels);
						addSortingIndexes($scope.videos);
					});
			}
		};

		$scope.loadMyItems = function() {
			User.current().$promise
				.then(function(data) {
					if (data._id!="0") {
						$scope.currentUser = data;
						$scope.logged = true;
						$scope.isAdmin = data.roles.some(function(r) { return r.isAdmin });
						var userId = data._id;
						return Video.userVideos({ userId:userId }).$promise
							.then(function(data) {
								$scope.myVideos = data;
								addSortingIndexes($scope.myVideos);
								return Channel.userChannels({ userId:userId }).$promise
							})
							.then(function(data) {
								$scope.myChannels = data;
								addSortingIndexes($scope.myChannels);
							})
					}
					else {
						$scope.logged = false;
					}
				});
			$scope.myVideos = [];
			$scope.myChannels = [];
		};

		$scope.doSearch();
		$scope.loadMyItems();

		$scope.sortDefault = function() {
			function sortFunction(a,b) {
				if (a.defaultSortingIndex < b.defaultSortingIndex) {
					return -1;
				}
				else if (a.defaultSortingIndex > b.defaultSortingIndex) {
					return 1;
				}
				else {
					return 0;
				}
			}

			$scope.channels.sort(sortFunction);
			$scope.videos.sort(sortFunction);
			$scope.myVideos.sort(sortFunction);
			$scope.myChannels.sort(sortFunction);
		};

		$scope.sortName = function() {
			function sortFunction(a,b) {
				a = a.title.trim().toLowerCase();
				b = b.title.trim().toLowerCase();
				if (a < b) {
					return -1;
				}
				else if (a > b) {
					return 1;
				}
				else {
					return 0;
				}
			}

			$scope.channels.sort(sortFunction);
			$scope.videos.sort(sortFunction);
			$scope.myVideos.sort(sortFunction);
			$scope.myChannels.sort(sortFunction);
		};

		$scope.sortDate = function() {
			function sortFunction(a,b) {
				a = new Date(a.creationDate);
				b = new Date(b.creationDate);
				if (a > b) {
					return -1;
				}
				else if (a < b) {
					return 1;
				}
				else {
					return 0;
				}
			}

			$scope.channels.sort(sortFunction);
			$scope.videos.sort(sortFunction);
			$scope.myVideos.sort(sortFunction);
			$scope.myChannels.sort(sortFunction);
		};

		$scope.sortAuthor = function() {
			function sortFunction(a,b) {
				a = a.owner.length && a.owner[0].contactData && a.owner[0].contactData.name;
				b = b.owner.length && b.owner[0].contactData && b.owner[0].contactData.name;
				if (a < b) {
					return -1;
				}
				else if (a > b) {
					return 1;
				}
				else {
					return 0;
				}
			}

			$scope.channels.sort(sortFunction);
			$scope.videos.sort(sortFunction);
			$scope.myVideos.sort(sortFunction);
			$scope.myChannels.sort(sortFunction);
		};

		if ($scope.channelId) {
			loadChannelParents();
		}

		// Cargar el contador de vídeos
		Video.count().$promise
			.then(function(result) {
				$scope.totalVideos = result.count;
			});
	}]);

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

