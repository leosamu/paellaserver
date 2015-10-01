(function() {
	var catalogModule = angular.module('catalogModule');

	catalogModule.controller('VideoEditModalController', ["$scope", "$translate", "$modalInstance", "User", "videoData", "advancedForm", "type", function($scope, $translate, $modalInstance, User, videoData, advancedForm, type) {
		var savedData = {};
		try {
			savedData = JSON.parse($.cookie('cachedUserData'));
		}
		catch(e) {}

		$scope.videoData = {};
		$scope.operatorData = {};
		$scope.acceptText = videoData!=null ? "edit_text":"create_text";
		$scope.titleText =  videoData!=null ? "edit_video_text_title":"create_video_text_title";
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

		function loadUser(id) {
			return User.find({ id:id }).$promise;
		}

		function setOperatorData() {
			User.current().$promise
				.then(function(data) {
					if (data._id != "0") {
						$scope.operatorData.id = data._id;
						$scope.operatorData.name = data.contactData.name;
						$scope.operatorData.lastName = data.contactData.lastName;
						$scope.operatorData.email = data.contactData.email;
					}
					else {
						$scope.operatorData.id = "";
						$scope.operatorData.name = "";
						$scope.operatorData.lastName = "";
						$scope.operatorData.email = "";
					}
				});
		}

 		function setVideoData(dbVideoData) {
			if (!dbVideoData) {
				$scope.videoData.title = savedData.title || "";
				$scope.videoData.authorId = savedData.authorId || "";
				$scope.videoData.authorName = savedData.authorName || "";
				$scope.videoData.authorLastName = savedData.authorLastName || "";
				$scope.videoData.authorEmail = savedData.authorEmail || "";
				$scope.videoData.fileName = "polimedia_muxed.mp4";
				$scope.videoData.resW = 1280;
				$scope.videoData.resH = 720;
				$scope.videoData.path = "";
				$scope.videoData.hidden = savedData.hidden;
				$scope.videoData.hiddenInSearches = savedData.hidenInSearches;
				$scope.videoData.link = "";

				$scope.selectedLanguage = { "id":"es" };

				setOperatorData(null);
			}
			else {
				var mainOwner = dbVideoData.owner[0];
				var video = dbVideoData.source && dbVideoData.source.videos && dbVideoData.source.videos[0];
				$scope.type = dbVideoData.source && dbVideoData.source.type;

				loadUser(mainOwner)
					.then(function(ownerData) {
						$scope.videoData.authorId = ownerData._id;
						$scope.videoData.authorName = ownerData.contactData.name;
						$scope.videoData.authorLastName = ownerData.contactData.lastName;
						$scope.videoData.authorEmail = ownerData.contactData.email;
						return loadUser(video.operator);
					})
					.then(function(operatorData) {
						$scope.operatorData.id = operatorData._id;
						$scope.operatorData.name = operatorData.contactData.name;
						$scope.operatorData.lastName = operatorData.contactData.lastName;
						$scope.operatorData.email = operatorData.contactData.email;

						$scope.videoData.title = dbVideoData.title;
						$scope.videoData.fileName = video.src_file || video.src;
						$scope.videoData.link = video.src_file ? video.src : null;
						$scope.videoData.resW = video.width;
						$scope.videoData.resH = video.height;
						$scope.videoData.path = video.path;
						$scope.videoData.hidden = dbVideoData.hidden;
						$scope.videoData.hiddenInSearches = dbVideoData.hidenInSearches;

						$scope.videoData.unprocessed = dbVideoData.unprocessed;

						$scope.selectedLanguage = { "id":dbVideoData.language };
					});
			}
		}

		function getDBVideoData() {
			var saveData = JSON.stringify($scope.videoData);
			$.cookie('cachedUserData', saveData);
			return {
				title: $scope.videoData.title,
				source: {
					type: $scope.type,
					videos: [
						{
							mimetype: 'video/mp4',
							src: $scope.videoData.fileName,
							width: $scope.videoData.resW,
							height: $scope.videoData.resH,
							operator: $scope.operatorData.id,
							recordingDate: Date.now()
						}
					]
				},
				language: $scope.selectedLanguage.id,
				owner:[ $scope.videoData.authorId ],
				hidden:$scope.videoData.hidden,
				hiddenInSearches:$scope.videoData.hiddenInSearches,
				unprocessed:$scope.videoData.unprocessed
			};
		}

		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.accept = function() {
			var dbVideoData = {};
			dbVideoData.title = $scope.videoData.title;

			if (!$scope.videoData.authorId) {
				var authorData = {
					contactData:{
						name: $scope.videoData.authorName,
						lastName: $scope.videoData.authorLastName,
						email: $scope.videoData.authorEmail
					}
				};
				User.create(authorData).$promise
					.then(function(data) {
						if (data) {
							$scope.videoData.authorId = data._id;
							$modalInstance.close(getDBVideoData());
						}
						// TODO: Informar del error al crear el usuario
					});
			}
			else {
				$modalInstance.close(getDBVideoData());
			}
		};

		setVideoData(videoData);
	}]);

	catalogModule.factory('VideoEditPopup', ['$modal',function($modal) {
		return function(videoData,advancedEdit,type,onDone) {
			var modalInstance = $modal.open({
				templateUrl:'catalog/directives/video-edit.html',
				controller:'VideoEditModalController',
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
