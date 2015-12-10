(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.controller("AdminVideosNewController", ["$scope", "$window", "MessageBox", "VideoCRUD", "CatalogCRUD", "User", "UploadQueue", function($scope, $window, MessageBox, VideoCRUD, CatalogCRUD, User, UploadQueue){
		$scope.updating = false;
		
		CatalogCRUD.query({type:"videos"}).$promise.then(function(catalogs){
			var defaultCatalog;
			if (catalogs.list.length == 1) {
				defaultCatalog = catalogs.list[0]._id;
			}
		
			$scope.video = {
				unprocessed: true, 
				creationDate: Date.now(),
				source: { type: 'polimedia' },
				published: { status: true },
				owner: [User.current()],
				pluginData: {
					unesco: { codes:[] }
				},
				catalog: defaultCatalog
			};
		});
				
		$scope.$watch('video.catalog', function(catalog){		
			if (catalog) {
				CatalogCRUD.get({id:catalog}).$promise
				.then(
					function(c) {						
						$scope.video.repository = {_id: c.defaultRepository};
					},
					function() {
						$scope.video.repository = null;
					}
				);				
			}
			else {
				if ($scope.video) {
					$scope.video.repository = null;
				}
			}			
		});
		
		$scope.createVideo = function() {
			$scope.updating = true;
			VideoCRUD.save($scope.video).$promise.then(
				function(v) {
					UploadQueue().addVideo({
						_id: v._id,
						title: v.title
					});
					return MessageBox("Video creado", "El video se ha creado correctamente.");				
				},
				function() {
					return MessageBox("Error", "Ha ocurrido un error al crear el video.");
				}
			).finally(function(){
				$scope.video.creationDate = Date.now();
				$scope.video.title = "";			
				$scope.updating = false;
			});
		}
	}]);	
	
	
	
	app.controller("AdminVideosEditController", ["$scope","$routeParams", "$window", "MessageBox", "VideoCRUD", function($scope, $routeParams, $window, MessageBox, VideoCRUD){	
		$scope.updating = false;

		VideoCRUD.get({id: $routeParams.id}).$promise.then(function(v){
			$scope.video = v;
			
			if (!$scope.video.pluginData) { $scope.video.pluginData = {} }
			if (!$scope.video.pluginData.unesco) { $scope.video.pluginData.unesco = {codes:[]} }
			
			$scope.video.creationDate = new Date($scope.video.creationDate);
			if ($scope.video.published && $scope.video.published.publicationDate) {
				$scope.video.published.publicationDate = new Date($scope.video.published.publicationDate);
			}
		});
				
		$scope.updateVideo = function() {
			$scope.updating = true;
			VideoCRUD.update($scope.video).$promise.then(
				function() {
					if ($window.history.length > 1) {
						$window.history.back();
					}
					else {
						return MessageBox("Video actualizado", "El video se ha actualizado correctamente.");
					}
				},
				function() {
					return MessageBox("Error", "Ha ocurrido un error al actualizar el video.");
				}
			).finally(function(){
				$scope.updating = false;
			});
		}
	}]);
	
	
	app.controller("AdminVideosListController", ["$scope", "$modal", "$base64", "$timeout", "VideoCRUD", "Filters", "AdminState", "MessageBox",
	function($scope, $modal, $base64, $timeout, VideoCRUD, Filters, AdminState, MessageBox) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get('video');
		$scope.timeoutReload = null;
		$scope.timeoutSearchText = null;


		$scope.$watch('selectAll', function(value, old){
			if (value != old) {
				try{
					$scope.videos.list.forEach(function(v){
						v.selected = value;
					});
				}
				catch(e) {}
			}
		});

		$scope.$watch('state.videoFilters', function(){ 
			if ($scope.state.videoFilters) {
				var final_query = Filters.makeQuery($scope.state.videoFilters.filters || [], $scope.state.videoFilters.searchText);
				$scope.filterQuery = $base64.encode(JSON.stringify(final_query));
				$scope.reloadVideos();
			}
		}, true );

		$scope.$watch('currentPage', function(){ $scope.reloadVideos(); });
		
		$scope.reloadVideos = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {			
				VideoCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
				.$promise.then(function(data){
					$scope.videos = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};


		$scope.deleteVideo = function(v) {
			var reloadVideos = $scope.reloadVideos;
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteVideo.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						VideoCRUD.remove({id: v._id}).$promise
						.then(
							function(){
								$modalInstance.close();
								//reloadVideos();
								v.deletionDate = Date.now();
							},
							function(){
								$modalInstance.close();
								MessageBox("Error", "An error has happened deleting the video.");
							}
						);
					};
				}
			});
		};
		
		
		
		$scope.restoreVideo = function(v) {
			var reloadVideos = $scope.reloadVideos;
			
			var modalInstance = $modal.open({
				templateUrl: 'confirmRestoreVideo.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						VideoCRUD.get({id: v._id}).$promise
						.then(
							function(v2) {
								v2.deletionDate = null;
								return VideoCRUD.update(v2).$promise;
							},
							function(){
								MessageBox("Error", "An error has happened restoring the channel.");
							}
						)
						.then(
							function(){										
								//reloadVideos();
								v.deletionDate = null;
							},
							function(){
								MessageBox("Error", "An error has happened restoring the channel.");
							}
						)
						.finally(function(){
							$modalInstance.close();							
						});
					};
				}
			});
		};
	}]);
	
	
})();