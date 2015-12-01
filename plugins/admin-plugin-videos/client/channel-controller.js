(function() {
	var app = angular.module('adminPluginVideos');

	app.controller("AdminChannelsNewController", ["$scope", "$window", 'User', 'CatalogCRUD', "ChannelCRUD", "MessageBox", function($scope, $window, User, CatalogCRUD, ChannelCRUD, MessageBox){
		
		$scope.channel= {
			owner: [User.current()],
			permissions:[],
			videos:[],
			children:[],
			pluginData: {},
			repository: {},
			creationDate: new Date()
		};
		
		
		$scope.$watch('channel.catalog', function(catalog) {
			if (catalog) {
				CatalogCRUD.get({id:catalog}).$promise
				.then(
					function(c) {						
						$scope.channel.repository = {_id: c.defaultRepository};
					},
					function() {
						$scope.channel.repository = null;
					}
				);
				
			}
			else {
				$scope.channel.repository = null;				
			}
		});
		
		
		$scope.createChannel = function() {
			$scope.updating = true;
			ChannelCRUD.save($scope.channel).$promise.then(
				function() {
					if ($window.history.length > 1) {
						$window.history.back();
					}
					else {
						return MessageBox("New channel", "A new channel has benn created.");
					}
				},
				function() {
					return MessageBox("Error", "An error has happened creating the channel.");
				}
			).finally(function(){
				$scope.updating = false;
			});						
		}
	}]);
	
	
	app.controller("AdminChannelsEditController", ["$scope","$routeParams", "$window", "MessageBox", "ChannelCRUD", "VideoCRUD", "CatalogCRUD", "AdminState", function($scope, $routeParams, $window, MessageBox, ChannelCRUD, VideoCRUD, CatalogCRUD, AdminState) {
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
		};
				
	}]);	
	
	
	app.controller("AdminChannelsListController", ["$scope", "$modal", "$base64", "$timeout", "ChannelCRUD", "Filters", "Actions", "AdminState", "MessageBox",
	function($scope, $modal, $base64, $timeout, ChannelCRUD, Filters, Actions, AdminState, MessageBox) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get("channel");;
		$scope.channelActions = Actions.$get("channel");
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
								reloadChannels();
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
						ChannelCRUD.remove({id: ch._id}).$promise
						.then(
							function(){
								$modalInstance.close();
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
										reloadChannels();
									},
									function(){
										MessageBox("Error", "An error has happened restoring the channel.");
									}
								)								
							},
							function(){
								$modalInstance.close();
								MessageBox("Error", "An error has happened restoring the channel.");
							}
						);
					};
				}
			});
		};
				
		
	
		$scope.doAction = function(action) {
			
			var selectedChannels= [];			
			$scope.channels.list.forEach(function(v){
				if (v.selected) {
					selectedChannels.push(v);
				}
			});						
				
			Actions.runAction(action, selectedChannels);
		};	
	}]);
	
	
})();