(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.controller('ChannelEditModalController', ["$scope", "$translate", "$modalInstance", "channelData", function($scope, $translate, $modalInstance, channelData) {
		$scope.channelData = channelData || {};
		$scope.acceptText = channelData!=null ? "edit_text":"create_text";
		$scope.titleText =  channelData!=null ? "edit_channel_text_title":"create_channel_text_title";

		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.accept = function() {
			console.log($scope.channelData);
			$modalInstance.close($scope.selected);
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

			modalInstance.result.then(function(selected) {
				if (typeof(onDone)=='function') onDone(channelData);
			});
		};
	}]);
})();
