

(function() {
	
	class AnnotationTrackPlugin extends paella.editor.TrackPlugin {
	
		newObjectId (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) {
			return 'anot' + s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
		}
		
		createStyle(_styleName,_annotationID)
		{
			var _style = "";
			switch (_styleName){					       
		        case "BANNER" :
			        _style = "#annotationID {color:rgba(255,255,255,1);background-color: rgba(0,0,0,0.6);text-align: justify;-moz-border-radius: 15px;border-radius: 15px;line-height: 3vmin;font-size: 1.2vw;padding: 1vw;position: absolute;bottom:70px;left:30px;right:30px;} #annotationID:hover { background-color: rgba(0,0,0,0.8);} #e28e0130-9824-11e5-88b4-a94245a618bnd a{color: rgb(255, 230, 45);} #annotationID a:visited{color: rgba(255, 255, 150, 0.80);}".replace(new RegExp("annotationID", 'g'), _annotationID);
			        break;
			    case "FULL":
			    	_style="#annotationID {color:rgba(255,255,255,1);background-color: rgba(0,0,0,0.6);text-align: justify;-moz-border-radius: 15px;border-radius: 15px;line-height: 3vmin;font-size: 1.2vw;padding: 1vw;position: absolute;bottom:40px;top:20px;left:30px;right:30px;} #annotationID:hover { background-color: rgba(0,0,0,0.8);} #e28e0130-9824-11e5-88b4-a94245a618ful a{color: rgb(255, 230, 45);} #annotationID a:visited{color: rgba(255, 255, 150, 0.80);}".replace(new RegExp("annotationID", 'g'),  _annotationID);								    	
					break;
			    case "NOTE":
			    	_style="#annotationID {color:rgba(255,255,255,1);background-color: rgba(0,0,0,0.6);text-align: justify;-moz-border-radius: 15px;border-radius: 15px;line-height: 3vmin;font-size: 1.2vw;padding: 1vw;position: absolute;bottom:70px;left:30px;width:40%;} #annotationID:hover { background-color: rgba(0,0,0,0.8);} #annotationID a{color: rgb(255, 230, 45);} #annotationID a:visited{color: rgba(255, 255, 150, 0.80);}".replace(new RegExp("annotationID", 'g'),  _annotationID);	
					break;
			    case "AD":
			    	_style="#annotationID .AdtextAnnotationLink {  left: 0;  top: 0;  position: absolute;  z-index: 1;  width: 18%;  height: 100%;  background-color: black;} #annotationID .AdtextAnnotationIMG{ position: relative;    left: 33%;    top: 33%;    width: 30%;    height: 30%; } #annotationID .AdtextAnnotationBody{    padding-left: 20%;    top: 30%;    position: absolute; } #annotationID {color:rgba(255,255,255,1);background-color: rgba(0,0,0,0.6);text-align: justify;-moz-border-radius: 15px;border-radius: 15px;line-height: 3vmin;font-size: 1.2vw;padding: 1vw;position: absolute;bottom:70px;left:30px;width:33%;height:16%;} #annotationID:hover { background-color: rgba(0,0,0,0.8);} #annotationID a{color: rgb(255, 230, 45);} .ADtextAnnotation a:visited{color: rgba(255, 255, 150, 0.80);}".replace(new RegExp("annotationID", 'g'),  _annotationID);							    	
			    	break;
			    case "MEMO":
			    	_style="#annotationID {color:rgb(0,0,0);background-color: rgba(247,247,247,0.30);border-style:dashed;border-color: rgba(100,100,100,0.8);text-align: justify;-moz-border-radius: 15px;border-radius: 15px;line-height: 3vmin;font-size: 1.2vw;padding: 1vw;position: absolute;bottom:10px;top:10px;left:30px;width:50%;} #annotationID:hover { background-color: rgba(0,0,0,0.8);} #annotationID a{color: rgb(255, 230, 45);} #annotationID a:visited{color: rgba(255, 255, 150, 0.80);}".replace(new RegExp("annotationID", 'g'),  _annotationID);
			    	break;
		        default:
		        	_style="";				                    
            }
			return _style;
		}
    		    
		isEnabled() {
			var self = this;
			self._tracks = [];
			self._originalAnnotations = [];
			return new Promise((resolve) => {
				paella.plugins.visualAnnotationPlugin.getAnnotations().then(function(annotations){
					self._originalAnnotations = annotations;
					annotations.forEach(function(annotation)
					{
						var _data = JSON.parse(annotation.content).data[Object.keys(JSON.parse(annotation.content).data)[0]];
						var _type = "Text"
						switch (_data.substring(0, 3))
						{
							case "<if":
								_type = "Embed"
							break;
							case "<a ":
								_type = "Link";
							break;
							default:
								_type = "Text";
						}
						self._tracks.push({
			              id: annotation['_id'],
			              s: annotation['time'],
			              e: annotation['time'] + annotation['duration'],
			              name: annotation['title'],
			              data: _data,
			              type: _type,
			              user: annotation['user'],
			              video: annotation['video'],
	           		      pauser: JSON.parse(annotation.content).pauser,
			              profile: JSON.parse(annotation.content).profile,			              
			              style: JSON.parse(annotation.content).style
	            		});				
	         			
					});					
				});
				
				resolve(true);
			});
		}
		
		
		
		getIndex() {
			return 10000;
		}

		getName() {
			return "annotationTrackPlugin";
		}

		getTrackName() {
			return "Visual Annotations";
		}

		getColor() {
			return "#FA8533";
		}

		getTextColor() {
			return "#F0F0F0";
		}

		getTrackItems() {
			return Promise.resolve(this._tracks);	
		}

		allowResize() {
			return true;
		}

		allowDrag() {
			return true;
		}

		allowEditContent() {
			return true;
		}

		onTrackChanged(id,start,end) {
			//base.log.debug('Track changed: id=' + id + ", start: " + start + ", end:" + end);
			console.log("Track changed: s=" + start + ", e=" + end);
		}

		onTrackContentChanged(id,content) {
			//base.log.debug('Track content changed: id=' + id + ', new content: ' + content);	
		}

		onSelect(trackItemId) {
			this._currentId = trackItemId;
			console.log('Track item selected: ' + this.getTrackName() + ", " + trackItemId);
		}

		onUnselect() {
			this._currentId = null;
			base.log.debug('Track list unselected: ' + this.getTrackName());
		}
		
		onSave() {
			var self = this;
			return new Promise((resolve,reject) => {
				
				/*managing previous versions of the annotations*/
						$.getJSON('/rest/video/' + paella.initDelegate.getId() + "/annotations",function(data){
						        
							              data.forEach(function(annotation)
											{
												$.ajax({
												    url: '/rest/video/' + annotation.video + '/annotation/' + annotation['_id'],
												    type: 'DELETE',
												    success: function(result) {
												        // Do something with the result
												        console.log(result);
												    }
												});
											});
							              
				        })
				        .then(
					        self._tracks.forEach(function(track)
							{
								var body = {};
								var annotation = {};
								annotation['_id'] = track.id;
								annotation.time = track.s;
					            annotation.duration =track.e - track.s;
					            annotation['type'] = track.type;
					            paella.player.accessControl.userData().then(function(ud) { 
							        annotation['user']= ud.username; 
							        annotation['video']= paella.initDelegate.getId();
						            annotation['title']= track.title;
						            var _content = {};
						            _content.pauser = track.pauser;
						            _content.profile = track.profile;						          
									_content.style = self.createStyle(track.style,annotation['_id']);
						            _content.data={}
						            _content.data.es = track.data;
						            annotation.content = JSON.stringify(_content); 
						            body['annotation']=annotation;
									$.post( '/rest/video/'+ track.video +'/annotation/' + track.id, body);	
								});
							})
				        );						
				
				/*console.log("aqui");
				paella.data.write('visualAnnotations',{id:paella.initDelegate.getId()},data,function(response,status) {
					resolve();
				});*/
				resolve();
			});
		}

		onDblClick(trackData) {
		}

		getTools() {
			return ["Create","Delete"];
		}

		onToolSelected(toolName) {
			self = this;
			if (toolName=="Delete" && this._currentId) {
				let deleteIndex = -1;
				this._tracks.some((track,index) => {
					if (track.id==this._currentId) {
						deleteIndex = index;
					}
				});
				if (deleteIndex!=-1) {
					paella.plugins.visualAnnotationPlugin.removeAnnotation(this._currentId)
					this._tracks.splice(deleteIndex,1);
					this.notifyTrackChanged();
				}
			}
			else if (toolName=="Create") {
			paella.player.videoContainer.currentTime()
					.then((_time) => {
						var annotation = {};
						annotation['_id'] = this.newObjectId();
						annotation.time = _time;
			            annotation.duration = 10;
			            annotation['type'] = "BANNER";
			            paella.player.accessControl.userData().then(function(ud) { 
				        annotation['user']= ud.username; 
				        annotation['video']= paella.initDelegate.getId();
			            annotation['title']= "Annotation title";
			            var _content = {};
			            _content.pauser = false;
			            _content.profile = "";
			            
			            var _style = "#annotationID {color:rgba(255,255,255,1);background-color: rgba(0,0,0,0.6);text-align: justify;-moz-border-radius: 15px;border-radius: 15px;line-height: 3vmin;font-size: 1.2vw;padding: 1vw;position: absolute;bottom:70px;left:30px;right:30px;} #annotationID:hover { background-color: rgba(0,0,0,0.8);} #annotationID a{color: rgb(255, 230, 45);} #annotationID a:visited{color: rgba(255, 255, 150, 0.80);}".replace(new RegExp("annotationID", 'g'), annotation['_id']);
						_content.style = _style;
			            _content.data={}
			            _content.data.es = "Your text here";
			            annotation.content = JSON.stringify(_content); 
			           
			            
			            paella.plugins.visualAnnotationPlugin.addAnnotation(annotation);
			            self._tracks.push({
						              id: annotation['_id'],
						              s: annotation['time'],
						              e: annotation['time'] + annotation['duration'],
						              name: annotation['title'],
						              data: "Your text here",
						              type: "Text",
						              user: annotation['user'],
						              video: annotation['video'],
				           		      pauser: JSON.parse(annotation.content).pauser,
						              profile: JSON.parse(annotation.content).profile,			              
						              style: JSON.parse(annotation.content).style
				            		});	
				            })
			           this.notifyTrackChanged();
					});			
			}
			
		}

		isToolEnabled(toolName) {
			return true;
		}
		
		isToggleTool(toolName) {			
			return toolName=="Tool 1";
		}

		buildToolTabContent(tabContainer) {

		}

		getSettings() {
			return null;
		}
	}

	new AnnotationTrackPlugin();

	
	
	var app = angular.module(paella.editor.APP_NAME);
	
	app.directive("annotationsidebar", function() {
		return {
			restrict: "E",
			templateUrl:"templates/es.upv.paella-editor.annotations/content.html",
			controller:["$scope","PaellaEditor",function($scope,PaellaEditor) {
				$scope.title = "Annotations";
				$scope.timer = null;
				$scope.delay = 500;
				$scope.annotationLoad=true;
				$scope.profileList = Object.keys(paella.Profiles.profileList);
				
				$scope.$watchCollection('selectedAnnotation', function() {
					if ($scope.annotationLoad==true)
						$scope.annotationLoad=false;
					else
					{
						if ($scope.timer) {
				            window.clearTimeout($scope.timer);
				        }
				        $scope.timer = window.setTimeout( function() {
				            $scope.timer = null;
				      
				            //type,user,video,title
				            var annotation = {};
				            annotation['_id'] = $scope.selectedAnnotation.id;
				            annotation.time = $scope.selectedAnnotation.s;
				            annotation.duration = $scope.selectedAnnotation.e - $scope.selectedAnnotation.s;
				            annotation['type'] = $scope.selectedAnnotation.style;
				            annotation['user']= $scope.selectedAnnotation.user;
				            annotation['video']= $scope.selectedAnnotation.video;
				            annotation['title']= $scope.selectedAnnotation.name;
				            var _content = {};
				            _content.pauser = $scope.selectedAnnotation.pauser;
				            _content.profile = $scope.selectedAnnotation.profile;
				     
				            _content.style = self.createStyle($scope.selectedAnnotation.style,annotation['_id']);;
				            _content.data={}
				            _content.data.es = $scope.selectedAnnotation.data;
				            annotation.content = JSON.stringify(_content); 
				             

				            
				            paella.plugins.visualAnnotationPlugin.updateAnnotation(annotation);
				            //this.notifyTrackChanged();
				        }, $scope.delay );
					}
						
    			});
    			
				PaellaEditor.subscribe($scope,() => {
					$scope.currentTrack = PaellaEditor.currentTrack;
					$scope.selectedType="";
					if (PaellaEditor.currentTrackItem){
						$scope.selectedAnnotation =PaellaEditor.currentTrackItem.trackData;
						$scope.annotationLoad=true;				
						paella.player.videoContainer.seekToTime(PaellaEditor.currentTrackItem.trackData.s);
						paella.player.play();
						paella.player.pause();
						
					}
					/*if ($scope.currentTrack) {
						$scope.trackName = $scope.currentTrack.name;	
					}*/
				});
			}]
		}
	});

	class AnnotationSideBar extends paella.editor.SideBarPlugin {
		checkEnabled() {
			return new Promise((resolve, reject) => {
				resolve(true);
			});
		}
		
		getName() {
			return "Annotations sidebar";
		}

		getTabName() {
			return "Annotations";
		}
		
		getContent() {
			console.log("asfsf");
		}
		
		getDirectiveName() {
			return "annotationsidebar";
		}
	}

	new AnnotationSideBar();
})();

