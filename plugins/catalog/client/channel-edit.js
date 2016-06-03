(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.controller('ChannelEditModalController', [
		"$scope",
		"$translate",
		"User",
		"Authorization",
		"$modalInstance",
		"channelData",
	function($scope, $translate, User, Authorization, $modalInstance, channelData) {
		$scope.updating = false;
		$scope.channelData = channelData || {};
		$scope.previousChannelTitle = $scope.channelData.title;
		$scope.acceptText = channelData!=null ? "edit_text":"create_text";
		$scope.titleText =  channelData!=null ? "edit_channel_text_title":"create_channel_text_title";

		$scope.visibility = ($scope.channelData.hidden == false)  ?'public' : 'hidden';
		
		

		$scope.$watch('visibility', function(){
			$scope.channelData.hidden = ($scope.visibility != 'public');
			$scope.channelData.hiddenInSearches = ($scope.visibility != 'public');
		})
/*
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
*/

		$scope.close = function() {
			$scope.channelData.title = $scope.previousChannelTitle;
			$modalInstance.dismiss('cancel');
		};

		$scope.accept = function() {
			// $scope.channelData.owner = [ $scope.owner._id ];
			// Remove the repository data from the thumbnail
			if ($scope.channelData.thumbnail) {
				var repo = $scope.channelData.repository;
				if (repo) {
					var repoUrl = repo.server + repo.endpoint + $scope.channelData._id + '/channels/';
					$scope.channelData.thumbnail = $scope.channelData.thumbnail.replace(repoUrl,"");
				}
				else {
					delete $scope.channelData.thumbnail;
				}
			}
			$modalInstance.close($scope.channelData);
		};

	}]);

	catalogModule.factory('ChannelEditPopup', ['$modal',function($modal) {
		return function(channelData) {
			var modalInstance = $modal.open({
				templateUrl:'catalog/directives/channel-edit.html',
				controller:'ChannelEditModalController',
				resolve:{
					channelData: function() {
						return channelData;
					}
				}
			});

			return modalInstance.result;
		};
	}]);
})();
