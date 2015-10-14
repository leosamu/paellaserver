(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.controller('ChannelEditModalController', ["$scope", "$translate", "User", "$modalInstance", "channelData", function($scope, $translate, User, $modalInstance, channelData) {
		$scope.channelData = channelData || {};
		$scope.previousChannelTitle = $scope.channelData.title;
		$scope.acceptText = channelData!=null ? "edit_text":"create_text";
		$scope.titleText =  channelData!=null ? "edit_channel_text_title":"create_channel_text_title";

		$scope.owner = {};

		function loadUser(id) {
			return User.find({ id:id }).$promise;
		}

		if ($scope.channelData.owner && $scope.channelData.owner.length) {
			var ownerId = typeof($scope.channelData.owner[0])=="object" ? $scope.channelData.owner[0]._id:$scope.channelData.owner[0];

			loadUser(ownerId)
				.then(function(userData) {
					$scope.owner = userData;
				});
		}

		$scope.close = function() {
			$scope.channelData.title = $scope.previousChannelTitle;
			$modalInstance.dismiss('cancel');
		};

		$scope.accept = function() {
			$modalInstance.close($scope.channelData);
		};
	}]);

	catalogModule.factory('ChannelEditPopup', ['$modal',function($modal) {
		return function(channelData,onDone) {
			var modalInstance = $modal.open({
				templateUrl:'catalog/directives/channel-edit.html',
				controller:'ChannelEditModalController',
				resolve:{
					channelData: function() {
						return channelData;
					}
				}
			});

			modalInstance.result.then(function(result) {
				if (typeof(onDone)=='function') onDone(result);
			});
		};
	}]);
})();
