(function() {
	var app = angular.module('adminPluginVideos');
	
	
	app.controller("AdminVideosNewController", ["$q", "$scope", "$window", "MessageBox", "VideoCRUD", "ChannelCRUD", "CatalogCRUD", "User", "UploadQueue", function($q, $scope, $window, MessageBox, VideoCRUD, ChannelCRUD, CatalogCRUD, User, UploadQueue){
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
				operator: [User.current()],
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
					
					var parents = [];
					$scope.parentChannels.forEach(function(pc){
						parents.push( ChannelCRUD.addVideo({parent:pc._id, video:v._id}).$promise );
					});
					
					$q.all(parents).then(
						function() {
							return MessageBox("Video creado", "El video se ha creado correctamente.");							
						},
						function() {
							return MessageBox("Video creado con problemas", "El video se ha creado correctamente, pero no se ha podido añadir a alguno de los canales.");
						}
					);
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
	
	
	
	app.controller("AdminVideosEditController", ["$q", "$scope","$routeParams", "$window", "MessageBox", "VideoCRUD", "ChannelCRUD",
	function($q, $scope, $routeParams, $window, MessageBox, VideoCRUD, ChannelCRUD){	
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
					var actions = [];								
					VideoCRUD.parents({id: $scope.video._id, limit: 1000}).$promise
					.then(function(parentsNow){
						// Remove videos
						parentsNow.list.forEach(function(c1){
							var exist = $scope.parentChannels.some(function(c2){ return (c1._id == c2._id); });
							if (!exist) {
								actions.push( ChannelCRUD.removeVideo({parent:c1._id, video:$scope.video._id}).$promise );								
							}							
						});
						// Add videos
						$scope.parentChannels.forEach(function(pc) {
							actions.push( ChannelCRUD.addVideo({parent:pc._id, video:$scope.video._id}).$promise );
						});
						// Wait for actions to finish
						$q.all(actions).then(
							function() {
								if ($window.history.length > 1) {
									$window.history.back();
								}
								else {
									return MessageBox("Video actualizado", "El video se ha actualizado correctamente.");
								}
							},
							function() {
								return MessageBox("Video actualizado con problemas", "El video se ha creado correctamente, pero no se ha podido añadir a alguno de los canales.");
							}
						);
					});					
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
				$scope.filterQuery = $base64.encode(unescape(encodeURIComponent(JSON.stringify(final_query))));
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