(function() {
	var app = angular.module('videoApuntesNotesModule');
	
	app.controller("videoApuntesNotesController", ['$scope', "$modal", "$base64", "$timeout", "videoApuntesNotesCRUD","AdminState", function($scope, $modal,$base64,$timeout, videoApuntesNotesCRUD,AdminState) {	
		//$scope.plugins = AdminPlugin;
		$scope.state=AdminState;
		$scope.currentPage=1;
		$scope.hasannotations=false;
		$scope.timeoutReload = null;
		
		$scope.initdate = new Date().setHours(0,0,0,0);
		$scope.enddate= new Date().setDate(new Date($scope.initdate).getDate()+8);
		

		/*User.current().$promise.then(function(currentUser) {
			$scope.currentUser = currentUser;
		});*/
		
		$scope.doAnnotations = function(recordId) {
			console.log("asfasdf");
			var datenow = Date.now();
			$scope.recordings.some(function(element,index,array)
			{
				
				if(datenow <= element.endRecord && datenow >= Date.parse(element.startRecord) && element._id == recordId) 
				{
					document.location.href = '/#/videoapuntes-notes/notes/' + element._id
				}  
				
			}
			);
		}

		$scope.$watchGroup(['currentPage','initdate','enddate'], function(){ $scope.reloadRecordings(); });
		
		$scope.reloadRecordings = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}	
			
			$scope.loadingRecordings = true;
			$scope.timeoutReload = $timeout(function() {				
				videoApuntesNotesCRUD.recordings({ start:$scope.initdate, end:$scope.enddate, filters:$scope.filterQuery})
				.$promise.then(function(data){
					$scope.recordings = data;
					$scope.recordings.total = data.length;
					$scope.loadingRecordings = false;
					$scope.timeoutReload = null;
					
					console.log("Waaagh");
					data.forEach(function(recording,index){
						videoApuntesNotesCRUD.search({id:data[index]['_id']
					}).$promise.then(function(annotations){										
										$scope.recordings[index]['endRecord'] = Date.parse($scope.recordings[index]['startRecord'] ) + $scope.recordings[index]['duration']  * 60000
										if (annotations.length>0)											
											$scope.recordings[index]['hasannotations']=true;
										else
											$scope.recordings[index]['hasannotations']=false;
										});
					});
					
					

				});
			
			}, 500);
		};
		
	}]);


	app.controller("AdminUnauthorizedController", ['$scope', function($scope) {
	}]);		
	
})();


$(window).resize(function() {
			var c = $('#canvas');
			var ct = c.get(0).getContext('2d');
			var container = $(c).parent();
			c.attr('width', $(container).width() ); //max width
       		c.attr('height', '200px' ); //max height
       });