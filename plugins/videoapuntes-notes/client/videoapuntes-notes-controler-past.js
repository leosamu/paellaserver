(function() {
	var app = angular.module('videoApuntesNotesModule');
	
	app.controller("videoApuntesNotesControllerPast", ['$scope', "$modal", "$base64", "$timeout", "videoApuntesNotesCRUD","AdminState", function($scope, $modal,$base64,$timeout, videoApuntesNotesCRUD,AdminState) {	
		//$scope.plugins = AdminPlugin;
		$scope.state=AdminState;
		$scope.currentPage=1;
		$scope.hasannotations=true;
		$scope.timeoutReload = null;
				
		$scope.enddate= new Date().setHours(0,0,0,0);
		$scope.initdate = new Date().setDate(new Date($scope.enddate).getDate()-15);
		
		

		/*User.current().$promise.then(function(currentUser) {
			$scope.currentUser = currentUser;
		});*/
		
		 
		$scope.showAnnotations = function(recordId) {
			var modalInstance = $modal.open({
				templateUrl: 'videoapuntes-notes/views/modal/notes.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {					
					videoApuntesNotesCRUD.search({id:recordId})
					.$promise.then(function(data){
						$scope.recordId = recordId;
						$scope.anotations = data;
						$scope.anotations.forEach(function(annotation,index){
							//todo mostrar icono dependiendo del tipo de anotacion y en las de imagen/texto ademas mostrar la imagen o texto en un popup
							$scope.anotations[index].Data = JSON.parse($scope.anotations[index].content).data.es 
							//$scope.anotations[index].Data = "patata";
							switch($scope.anotations[index].Data){
								case "like":
									$scope.anotations[index].Data='<i class="glyphicon glyphicon-thumbs-up"></i>'
									break;
								case "dislike":
									$scope.anotations[index].Data='<i class="glyphicon glyphicon-thumbs-down"></i>'
									break;
								case "question":
									$scope.anotations[index].Data='<i class="glyphicon glyphicon-question-sign"></i>'
									break;
								case "picture":
									$scope.anotations[index].Data='<i class="glyphicon glyphicon-question-sign"></i>'
									break;
								case "camera":
									$scope.anotations[index].Data='<i class="glyphicon glyphicon-question-sign"></i>'
									break;
								default:
								//replace this to add a popup
									if ($scope.anotations[index].Data.startsWith('data:image/png;'))
										$scope.anotations[index].Data= '<img src="' + $scope.anotations[index].Data  + '">';
									else
										$scope.anotations[index].Data=$scope.anotations[index].Data;
									break;
								
							}
						})
					});
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						$modalInstance.close();
					};
				}				
			});
			
			modalInstance.result
			.then(function() {
				return TaskCRUD.remove({id:task._id}).$promise;
			})
			.then(function() {
				$scope.reloadTasks();
			});
		};

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

//todo change this into a directive
$(window).resize(function() {
			try{
					var c = $('#canvas');
					var ct = c.get(0).getContext('2d');
					var container = $(c).parent();
					c.attr('width', $(container).width() ); //max width
					c.attr('height', '200px' ); //max height
			}catch(excp){

			}			
       });