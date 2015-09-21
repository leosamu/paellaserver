(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.directive('adminMenu',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/admin-menu.html",
			scope: {
				currentUser:"=",
				currentChannel:"="
			},
			controller: ['$scope','Channel','ChannelEditPopup', function ($scope,Channel,ChannelEditPopup) {
				$scope.status = {
					isopen: false
				};

				$scope.showMenu = function() {
					return $scope.currentUser!=null;
				};

				$scope.createChannel = function() {
					ChannelEditPopup(null, function(channelData) {
						console.log("Create channel");
					});
				};
			}]
		};
	});

})();

