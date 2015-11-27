(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.controller('VideoUploadModalController', [
		"$scope",
		"$translate",
		"$modalInstance",
		"User",
		"Upload",
		"UploadQueue",
		"videoData",
		"advancedForm",
		"type",
	function($scope, $translate, $modalInstance, User, Upload, UploadQueue, videoData, advancedForm, type) {
		var savedData = {};
		try {
			savedData = JSON.parse($.cookie('cachedUserData'));
		}
		catch(e) {}

		$scope.videoData = {};
		$scope.editVideoId = null;
		$scope.acceptText = videoData!=null ? "edit_text":"create_text";
		$scope.titleText =  videoData!=null ? "upload_video_text_title":"upload_video_text_title";
		$scope.advancedForm = advancedForm;
		$scope.type = type;

		$scope.validLanguages = [
			{ "id":"es", "name":"es" },
			{ "id":"en", "name":"en" },
			{ "id":"it", "name":"it" },
			{ "id":"fr", "name":"fr" },
			{ "id":"pt", "name":"pt" },
			{ "id":"de", "name":"de" },
			{ "id":"ca", "name":"ca" },
			{ "id":"af", "name":"af" },
			{ "id":"lt", "name":"lt" },
			{ "id":"nl", "name":"nl" },
			{ "id":"da", "name":"da" },
			{ "id":"hu", "name":"hu" },
			{ "id":"ja", "name":"ja" },
			{ "id":"ru", "name":"ru" },
			{ "id":"cs", "name":"cs" },
			{ "id":"no", "name":"no" },
			{ "id":"fi", "name":"fi" },
			{ "id":"kk", "name":"kk" },
			{ "id":"ar", "name":"ar" }
		];
		$scope.selectedLanguage = {};
		
		$scope.validLanguages.forEach(function(item) {
			item.name = $translate.instant(item.name);
		});
		
		$scope.file = {};
		
		$scope.selectFile = function(files) {
			$scope.file.fileName = files[0].name;
			$scope.file.fileType = files[0].type;
			$scope.file.fileSize = files[0].size;
			$scope.file.fileLastModified = files[0].lastModified;
			$scope.file.fileLastModifiedDate = files[0].lastModifiedDate;
		}
		
																									
		$scope.upload = function (files) {
			if ($scope.editVideoId) {	
				Upload.upload({
					url:'rest/video/' + $scope.editVideoId + '/upload',
					file: files
				}).then(function(resp) {
						console.log("done");
					},
					function(resp) {
						console.log("error");
					},
					function(evt) {
						console.log("progress");
					});
			}
		};
		

		function loadUser(id) {
			return User.current().$promise;
		}
		// Take the users input from the html forms
 		function setVideoData(dbVideoData) {
			if (!dbVideoData) {
				$scope.videoData.title = savedData.title || "";
				$scope.videoData.hidden = savedData.hidden;
				$scope.videoData.hiddenInSearches = savedData.hidenInSearches;
				$scope.selectedLanguage = { "id":"es" };
				$scope.videoData.unescoCodes = savedData.unescoCodes || [];
			}							
		}
		
		// Take the current user and his information
		User.current().$promise
			.then(function(data) {
				$scope.videoData.owner = data._id;
				$scope.videoData.authorEmail = data.contactData.email;
				$scope.videoData.lastName = data.contactData.lastName;
				$scope.videoData.name = data.contactData.name;
			});
			
		// Video Data
		function getDBVideoData() {
			var saveData = JSON.stringify($scope.videoData);
			$.cookie('cachedUserData', saveData);
			var videoDataResult = {
				title: $scope.videoData.title,
				source: {
					type: $scope.type,
					videos: [
						{
							mimetype: 'video/mp4',
							src: $scope.videoData.fileName,
							width: $scope.videoData.resW,
							height: $scope.videoData.resH,
							recordingDate: Date.now()
						}
					]
				},
				language: $scope.selectedLanguage.id,
				owner: $scope.videoData.owner,
				hidden:$scope.videoData.hidden,
				hiddenInSearches:$scope.videoData.hiddenInSearches,
				pluginData:{
					unesco:{
						codes:$scope.videoData.unescoCodes
					}
				}
			};
			
			if ($scope.editVideoId) {
				result._id = $scope.editVideoId;
			}
			return videoDataResult;
		}

		// File Data
		function getDBFileData() {
			var saveData = JSON.stringify($scope.file);
			var fileDataResult = {
				name: $scope.file.fileName,
				type: $scope.file.fileType,
				size: $scope.file.fileSize,
				lastModified: $scope.file.fileLastModified,
				lastModifiedData: $scope.file.fileLastModifiedDate
				
			};
			return fileDataResult;
		}

		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};
		// What it happens when user clicks the accept button
		$scope.accept = function() {
			var dbVideoData = {};
			dbVideoData.owner = $scope.videoData.owner;
			dbVideoData.authorEmail = $scope.videoData.authorEmail;
			dbVideoData.lastName = $scope.videoData.lastName;
			dbVideoData.name = $scope.videoData.name;	
			dbVideoData.title = $scope.videoData.title;
			dbVideoData.unescoCodes = $scope.videoData.unescoCodes;			
			dbVideoData.hidden = $scope.videoData.hidden;
			dbVideoData.hiddenInSearches = $scope.videoData.hiddenInSearches;
			$modalInstance.close({
				videoData:getDBVideoData(), 
				fileData:getDBFileData()
			});
			
		};

		setVideoData(videoData);
	}]);

	catalogModule.factory('VideoUploadPopup', ['$modal',function($modal) {
		return function(videoData,advancedEdit,type,onDone) {
			var modalInstance = $modal.open({
				templateUrl:'catalog/directives/video-upload.html',
				controller:'VideoUploadModalController',
				resolve:{
					videoData: function() {
						return videoData;
					},
					advancedForm: function() {
						return advancedEdit;
					},
					type: function() {
						return type;
					}
				}
			});

			modalInstance.result.then(function(result) {
				if (typeof(onDone)=='function') onDone(result);
			});
		};
	}]);
})();