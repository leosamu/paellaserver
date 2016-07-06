(function() {
	var app = angular.module('adminPluginOA');
	
		
	
	app.controller("AdminOAListController", ["$scope", "$modal", "$base64", "$timeout", "$http", "VideoCRUD", "Filters", "AdminState", "MessageBox",
	function($scope, $modal, $base64, $timeout, $http, VideoCRUD, Filters, AdminState, MessageBox) {
		$scope.state=AdminState;

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = Filters.$get('oa');
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

		$scope.$watch('state.oaFilters', function(){ 
			if ($scope.state.oaFilters) {
				var qq = Filters.makeQuery($scope.state.oaFilters.filters || [], $scope.state.oaFilters.searchText);
				
				var final_query = {"$and": [
					qq,
					{"pluginData.OA.isOA": true}
				]};
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
		
		$scope.isWaitingToUpload = function(v) {		
			if (v && v.pluginData && v.pluginData.youtube) {
				return (v.pluginData.youtube.id==null) && (v.pluginData.youtube.task!=null);
			}
			else {
				return false;
			}		
		};
		$scope.isNotUploaded = function(v) {
			if (v && v.pluginData && v.pluginData.youtube) {
				return (v.pluginData.youtube.id==null) && (v.pluginData.youtube.task==null);
			}
			else {
				return true;
			}		
		};
		
		$scope.uploadVideo = function(v) {			
			$http.post('/rest/plugins/admin-plugin-oa/video/' + v._id + '/uploadToYoutube')
			.then(
				function(){
					return MessageBox("Subir a youtube", "Se ha marcado el video para subirlo a youtube.");
				},
				function(){
					return MessageBox("Error", "Ha ocurrido un error al procesar la solicitud.");					
				}
			)
			.finally(function(){
				$scope.reloadVideos();
			})
		}
	}]);	
	
})();