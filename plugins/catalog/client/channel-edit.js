(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.controller('ChannelEditModalController', ["$scope", "$translate", "$modalInstance", "channelData", function($scope, $translate, $modalInstance, channelData) {
		$scope.channelData = channelData || {};
		$scope.previousChannelTitle = $scope.channelData.title;
		$scope.acceptText = channelData!=null ? "edit_text":"create_text";
		$scope.titleText =  channelData!=null ? "edit_channel_text_title":"create_channel_text_title";

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
