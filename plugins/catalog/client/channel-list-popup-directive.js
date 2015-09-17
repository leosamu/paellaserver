(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.controller('ChannelListModalController', ["$scope", "$modalInstance", "items", function($scope, $modalInstance, items) {
		$scope.channels = items;
		$scope.selected = null;

		$scope.alertMe = function(item) {
			$scope.selected = item;
		};

		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.accept = function() {
			$modalInstance.close($scope.selected);
		};
	}]);

	catalogModule.factory('ChannelListPopup', ['$modal',function($modal) {
		return function(channelList,onSelected) {
			var modalInstance = $modal.open({
				templateUrl:'catalog/directives/channel-list-popup.html',
				controller:'ChannelListModalController',
				resolve:{
					items: function() {
						return channelList;
					}
				}
			});

			modalInstance.result.then(function(selected) {
				if (typeof(onSelected)=='function') onSelected(selected);
			});
		};
	}]);
})();
