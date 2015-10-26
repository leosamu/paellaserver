(function() {
	var app = angular.module('adminPluginVideos');
	
	app.factory('MessageBox', ['$modal', function($modal){
	
		return function(title, content){
			var modalInstance = $modal.open({
				template: '' +
					'<div class="modal-header">' +
					'	<h4 class="modal-title text-danger">'+ title +'</h4>' +
					'</div>' +
					'<div class="modal-body">' +
					'	<p>'+content+'</p>' +
					'</div>' +
					'<div class="modal-footer">' +
					'	<button type="button" class="btn btn-primary" ng-click="accept()">{{"Ok" | translate}}</button>' +
					'</div>',
				size: '',
				backdrop: 'static',
				keyboard: false,
				controller: function ($scope, $modalInstance) {
					$scope.accept = function () {
						$modalInstance.close();
					};
				}
			});	
			return modalInstance.result;
		};
	}]);
	
	
})();