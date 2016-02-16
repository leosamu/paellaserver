(function() {
	var app = angular.module('adminPluginVideos');

	app.controller("AdminChannelsNewController", ["$q", "$scope", "$window", 'User', 'CatalogCRUD', "ChannelCRUD", "MessageBox",
	function($q, $scope, $window, User, CatalogCRUD, ChannelCRUD, MessageBox){
		
		$scope.channel= {
			owner: [User.current()],
			permissions:[],
			videos:[],
			children:[],
			pluginData: {},
			repository: {},
			creationDate: new Date(),
			catalog: null
		};		
		CatalogCRUD.query({type:"catalog"}).$promise.then(function(catalogs){
			var defaultCatalog;
			if (catalogs.list.length == 1) {
				$scope.channel.catalog = catalogs.list[0]._id;
			}				
		});
		
		
		$scope.$watch('channel.catalog', function(catalog) {
			if (catalog) {
				CatalogCRUD.get({id:catalog}).$promise
				.then(
					function(c) {						
						$scope.channel.repository = {_id: c.defaultRepositoryForChannels};
					},
					function() {
						$scope.channel.repository = null;
					}
				);
				
			}
			else {
				if ($scope.channel) {
					$scope.channel.repository = null;
				}
			}
		});
		
		
		$scope.createChannel = function() {
			$scope.updating = true;
			ChannelCRUD.save($scope.channel).$promise.then(
				function(ch) {
								
					var parents = [];
					$scope.parentChannels.forEach(function(pc){
						parents.push( ChannelCRUD.addChannel({parent:pc._id, channel:ch._id}).$promise );
					});
					
					$q.all(parents).then(
						function() {
							if ($window.history.length > 1) {
								$window.history.back();
							}
							else {
								return MessageBox("New channel", "A new channel has benn created.");
							}
						},
						function() {
							return MessageBox("Canal creado con problemas", "El canal se ha creado correctamente, pero no se ha podido añadir a alguno de los canales.");
						}
					);				
				},
				function() {
					return MessageBox("Error", "An error has happened creating the channel.");
				}
			).finally(function(){
				$scope.updating = false;
			});						
		}
	}]);
	
	
	app.controller("AdminChannelsEditController", ["$q", "$scope","$routeParams", "$window", "MessageBox", "ChannelCRUD", "VideoCRUD", "CatalogCRUD", "AdminState", 
	function($q, $scope, $routeParams, $window, MessageBox, ChannelCRUD, VideoCRUD, CatalogCRUD, AdminState) {
		$scope.state = AdminState;
		$scope.channel = ChannelCRUD.get({id: $routeParams.id});
		$scope.updating = false;
		
		$scope.channel.$promise.then(function(channel){
			if (!channel.metadata) {
				channel.metadata = {};
			}
			if (channel && channel.metadata &&	(typeof(channel.metadata.keywords)=="string")) {
				channel.metadata.keywords = channel.metadata.keywords.split(",");
			}
			$scope.channel = channel;
			$scope.channel.creationDate = new Date(channel.creationDate);
		});


		/*
		window.onbeforeunload = function() {
			if (true)
				return "¿Seguro que quieres salir?";
		}

		*/
		
		
		$scope.updateChannel = function() {
			$scope.updating = true;		
			ChannelCRUD.update($scope.channel).$promise.then(
				function() {
					var actions = [];								
					ChannelCRUD.parents({id: $scope.channel._id, limit: 1000}).$promise
					.then(function(parentsNow){
						// Remove videos
						parentsNow.list.forEach(function(c1){
							var exist = $scope.parentChannels.some(function(c2){ return (c1._id == c2._id); });
							if (!exist) {
								actions.push( ChannelCRUD.removeChannel({parent:c1._id, channel:$scope.channel._id}).$promise );								
							}							
						});
						// Add videos
						$scope.parentChannels.forEach(function(pc) {
							actions.push( ChannelCRUD.addChannel({parent:pc._id, channel:$scope.channel._id}).$promise );
						});
						// Wait for actions to finish
						$q.all(actions).then(
							function() {
								if ($window.history.length > 1) {
									$window.history.back();
								}
								else {
									return MessageBox("Channel updated", "Channel updated correctly.");
								}
							},
							function() {
								return MessageBox("Canal actualizado con problemas", "El canal se ha creado correctamente, pero no se ha podido añadir a alguno de los canales.");
							}
						);
					});	
				},
				function() {
					return MessageBox("Error", "An error has happened updating the channel.");
				}
			).finally(function(){
				$scope.updating = false;
			});
		};
				
	}]);	
	
	
	app.controller("AdminChannelsListController", ["$scope", "$modal", "$base64", "$timeout", "ChannelCRUD", "Filters", "AdminState", "MessageBox",
	function($scope, $modal, $base64, $timeout, ChannelCRUD, Filters, AdminState, MessageBox) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get("channel");		
		$scope.timeoutReload = null;
		$scope.timeoutSearchText = null;	
	
	
		$scope.$watch('selectAll', function(value, old){
			if (value != old) {
				try{
					$scope.channels.list.forEach(function(ch){
						ch.selected = value;
					});
				}
				catch(e) {}
			}
		});
	
		$scope.$watch('state.channelFilters', function(){ 
			if ($scope.state.channelFilters) {
				var final_query = Filters.makeQuery($scope.state.channelFilters.filters || [], $scope.state.channelFilters.searchText);
				$scope.filterQuery = $base64.encode(JSON.stringify(final_query));
				$scope.reloadChannels();
			}
		}, true );
	
		$scope.$watch('currentPage', function(){ $scope.reloadChannels(); });
		
		$scope.reloadChannels = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingChannels = true;
			$scope.timeoutReload = $timeout(function() {			
				ChannelCRUD.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
				.$promise.then(function(data){
					$scope.channels = data;
					$scope.loadingChannels = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};
	
	
		$scope.deleteChannel = function(ch) {
			var reloadChannels = $scope.reloadChannels;
			
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteChannel.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						ChannelCRUD.remove({id: ch._id}).$promise
						.then(
							function(){
								$modalInstance.close();
								//reloadChannels();
								ch.deletionDate = Date.now();
							},
							function(){
								$modalInstance.close();
								MessageBox("Error", "An error has happened deleting the channel.");
							}
						);
					};
				}
			});
		};
		
		$scope.restoreChannel = function(ch) {
			var reloadChannels = $scope.reloadChannels;
			
			var modalInstance = $modal.open({
				templateUrl: 'confirmRestoreChannel.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						ChannelCRUD.get({id: ch._id}).$promise
						.then(
							function(c) {
								c.deletionDate = null;
								return ChannelCRUD.update(c).$promise;
							},
							function(){
								MessageBox("Error", "An error has happened restoring the channel.");
							}
						)
						.then(
							function(){										
								//reloadChannels();
								ch.deletionDate = null;
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