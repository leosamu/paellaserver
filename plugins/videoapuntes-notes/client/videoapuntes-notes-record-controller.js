(function() {
	var app = angular.module('videoApuntesNotesModule');
		
	
	app.controller("videoApuntesNotesRecordController", ['$scope', "$modal", "$base64", "$timeout", '$routeParams',"videoApuntesNotesCRUD","AdminState", function($scope, $modal,$base64,$timeout,$routeParams, videoApuntesNotesCRUD,AdminState) {	
		//$scope.plugins = AdminPlugin;
		$scope.state=AdminState;
		$scope.currentPage=1;
		$scope.timeoutReload = null;
        $scope.recording ={}
        //temporal fix
        $scope.recording.title=$routeParams.noteId;
        $scope.isVisibleText= false;
        $scope.isVisibleDraw= false;
        $scope.isVisibleButtons=true;
        $scope.isRecording=false;
        $scope.textNote="";
        $("#success-alert").hide();
		/*User.current().$promise.then(function(currentUser) {
			$scope.currentUser = currentUser;
		});*/
		
        $scope.showText = function(){
            $scope.isVisibleText = !$scope.isVisibleText;
            if ($scope.isVisibleText) {
                $scope.textNote="";
                $scope.isVisibleDraw=false;
                $scope.isVisibleButtons=false;
                $(canvas)[0].width=$(canvas)[0].width;
            }
        }
        $scope.showButtons = function(){
            $scope.isVisibleText =false;
            $scope.isVisibleDraw=false;
            $scope.isVisibleButtons=true;
            $(canvas)[0].width=$(canvas)[0].width;
        }
         $scope.showDraw = function(){
            $scope.isVisibleDraw = !$scope.isVisibleDraw;
            if ($scope.isVisibleDraw) {
                //clear the canvas $scope.textNote="";
                $scope.isVisibleText=false;
                $scope.isVisibleButtons=false;
               // $(canvas)[0].width=$(canvas)[0].width;
               // window.dispatchEvent(new Event('resize'));
            }
        }

        $scope.newObjectId = function(m,d,h,s) {
        	m = m || Math;
        	d = d || Date;
        	h = h || 16;
        	s = s || function(s) { return m.floor(s).toString(h); }
        	
			return 'anot' + s(d.now() / 1000) + ' '.repeat(h).replace(/./g, function () {
				return s(m.random() * h);
			});
		}


        $scope.addDrawing = function(){
            //(document.getElementById('canvas').toDataURL());
            $scope.addNote(document.querySelector('#canvas').toDataURL());
            $(canvas)[0].width=$(canvas)[0].width;
            showButtons();
        }
        $scope.addNote= function(notedata)
        {
            var body = {};
            var annotation = {};
            console.log("awuil");
            //annotation['_id'] = $scope.newObjectId();
            annotation.time = Math.floor((Date.now() - new Date($scope.recording.startRecord))/1000);
            annotation.duration =1;
            annotation['type'] = 'LiveAnnotation';				          
            annotation['user']= $scope.$parent.userName; 
            annotation['video']= $routeParams.noteId;
            annotation['title']= $scope.recording.title;
            var _content = {};
            _content.pauser = false;           						          
            _content.css = "";
            _content.data={};
            _content.data.es = notedata;
            annotation.content = JSON.stringify(_content); 
            body['annotation']=annotation;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#success-alert").slideUp(500);
            });   
            videoApuntesNotesCRUD.add({id:$routeParams.noteId},body);        
            showButtons();    
        }

		$scope.$watch('currentPage', function(){ $scope.reloaRecording(); });
		
        $scope.$watch(function(){return $('#paellaPlayer_loader').css("display")=="none"},function(newValue,oldValue){
            
            $scope.isRecording=newValue;
            
            
        });

		$scope.reloaRecording = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingRecordings = true;
			$scope.timeoutReload = $timeout(function() {	
                //TODO need a rest to load recording data by id
				videoApuntesNotesCRUD.recordings({id:$routeParams.noteId})
				.$promise.then(function(data){
					$scope.recording = $.grep(data, function(e){ return e['_id'] == $scope.recording.title; })[0];
					$scope.loadingRecordings = false;
					$scope.timeoutReload = null;
				})
			}, 500);
		};
		
	}]);


	app.controller("AdminUnauthorizedController", ['$scope', function($scope) {
	}]);		
	
})();