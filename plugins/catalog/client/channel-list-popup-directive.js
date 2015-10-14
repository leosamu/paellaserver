(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.controller('ChannelListModalController', ["$scope", "$modalInstance", "items", "navMode", "title", function($scope, $modalInstance, items, navMode, title) {
		$scope.channels = items;
		$scope.selected = null;
		$scope.navMode = navMode;
		$scope.title = title;

		$scope.selectItem = function(item) {
			$scope.selected = item;
		};

		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.accept = function() {
			$modalInstance.close($scope.selected);
		};

		$scope.getChannelUrl = function(channel) {
			return "#/catalog/channel/" + channel._id;
		};
	}]);

	catalogModule.factory('ChannelListPopup', ['$modal',function($modal) {
		return function(channelList,navMode,onSelected,title) {
			title = title || "channels";
			var modalInstance = $modal.open({
				templateUrl:'catalog/directives/channel-list-popup.html',
				controller:'ChannelListModalController',
				resolve:{
					items: function() {
						return channelList;
					},

					navMode: function() {
						return navMode;
					},

					title: function() {
						return title;
					}
				}
			});

			modalInstance.result.then(function(selected) {
				if (typeof(onSelected)=='function') onSelected(selected);
			});
		};
	}]);
})();
