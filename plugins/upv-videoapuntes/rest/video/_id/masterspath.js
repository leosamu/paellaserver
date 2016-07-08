var User = require(__dirname + '/../../../../../models/user');
var Catalog = require(__dirname + '/../../../../../models/catalog');
var Video = require(__dirname + '/../../../../../models/video');
var AuthController = require(__dirname + '/../../../../../controllers/auth');
var UPVController = require(__dirname + '/../../../../../controllers/upv');
var configure = require("../../../../../configure.js");

var request = require('request')
var Q = require('q');


function getOrCreateUser(userInfo) {

	var deferred = Q.defer();
	User.findOne({"contactData.email": userInfo.email}, function(err, user){
		if (err) { return deferred.reject(500); }
		
		if (user) {
			deferred.resolve(user);
		}
		else {
			UPVController.Utils.userByEmail(userInfo.email)
			.then(
				function(upvuser) {
					upvuser = JSON.parse(upvuser);
					User.findOne({"contactData.email": upvuser.email}, function(err, user){
						if (err) { return deferred.reject(500); }
						
						if (user) {
							deferred.resolve(user);
						}
						else {
							var user = new User({
							    "auth" : {
							        "UPV" : {
							            "nip" : upvuser.nip,
							            "dni" : upvuser.dni
							        }
							    },
							    "roles" : [],
							    "contactData" : {
							        "email" : upvuser.email,
							        "lastName" : upvuser.apellidos,
							        "name" : upvuser.nombre
							    }						
							});
							user.save(function(err){
								if (err) { return deferred.reject(500); }
								deferred.resolve(user);
							});
						}
							
					});
				},
				function() { 
					var user = new User({
					    "auth" : {},
					    "roles" : [],
					    "contactData" : {
					        "email" : userInfo.email,
					        "lastName" : userInfo.lastName,
					        "name" : userInfo.name
					    }						
					});
					user.save(function(err){
						if (err) { return deferred.reject(500); }
						deferred.resolve(user);
					});					
					
				}
			)
		}
	});
	
	return deferred.promise;
}

function getVideoApuntesSchoolroom(roomId) {
	var deferred = Q.defer();	
	var url = "https://videoapuntes.upv.es/rest/schoolrooms/" + roomId;
	request.get(url, {
		auth: {
			user: 'admin',
			pass: '91cf3469a842d3b391a4ff6f203e0bbde0d89614',
			sendImmediately: false
		},
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Requested-Auth': 'Digest'
		}							
	}, function(error, response, body) {
		if ((error) || (response.statusCode>=400)) {
			return deferred.reject();
		}
		var jbody = JSON.parse(body);
		deferred.resolve(jbody);
	});	
		
	return deferred.promise;	
}


function getVideoApuntesVideo(videoId) {
	var deferred = Q.defer();	
	var url = "https://videoapuntes.upv.es/rest/recordings/" + videoId;
	request.get(url, {
		auth: {
			user: 'admin',
			pass: '91cf3469a842d3b391a4ff6f203e0bbde0d89614',
			sendImmediately: false
		},
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Requested-Auth': 'Digest'
		}							
	}, function(error, response, body) {
		if ((error) || (response.statusCode>=400)) {
			return deferred.reject();
		}
		var jbody = JSON.parse(body);
		deferred.resolve(jbody);
	});	
		
	return deferred.promise;	
}

function getVideoApuntesOwner(ownerId) {
	var deferred = Q.defer();	
	var url = "https://videoapuntes.upv.es/rest/users/" + ownerId;
	request.get(url, {
		auth: {
			user: 'admin',
			pass: '91cf3469a842d3b391a4ff6f203e0bbde0d89614',
			sendImmediately: false
		},
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Requested-Auth': 'Digest'
		}							
	}, function(error, response, body) {
		if ((error) || (response.statusCode>=400)) {
			return deferred.reject();
		}
		var jbody = JSON.parse(body);
		deferred.resolve(jbody);
	});	
		
	return deferred.promise;
}


function createVideoFromVideoApuntes(videoId) {	
	var deferred = Q.defer();
		
		
	getVideoApuntesVideo(videoId)
	.then(function(video){
		return Q.all([getVideoApuntesOwner(video.owner), getVideoApuntesSchoolroom(video.schoolroom)])
		.spread(function(owner, sr){
			return [video, owner, sr];
		})
		.catch(	function(err) {deferred.reject(err);} )
	})
	.spread(function(va_video, va_owner, va_schoolroom){
	
		Catalog.findOne({_id:"videoapuntes"})
		.exec(function(err, catalog){
			if (err) {return deferred.reject();}
			
			var isPublic = false;
			var sakai_code;
			var creationDate = new Date(va_video.startRecord);
			var published_status = false			
			var published_date;
			
			if (va_video.publish == 'publish') {
				published_status = true;
				published_date = null;
			}
			else if (va_video.publish == 'nopublish') {
				published_status = false;
				published_date = null;			
			}
			else if (va_video.publish == 'delayed') {
				published_status = false;
				published_date = new Date(creationDate);			
				published_date.setDate(published_date.getDate() + 7);
			}

			if (va_video.privacy.type == 'public') {
				isPublic = true;
			}
			else if (va_video.privacy.type == 'sakai') {
				isPublic = false;
				sakai_code = va_video.privacy.sakai;
			}

			var selectedAudio = va_video.selectedAudio;
			if (selectedAudio == 'auto') {
				console.log(va_schoolroom);
				selectedAudio = va_schoolroom.preferedAudio;
			}
			
			var video = {
				_id: videoId,
				repository: catalog.defaultRepository,
				catalog: catalog._id,
				
				hidden: (isPublic == false),
				hiddenInSearches: (isPublic == false),
				hideSocial: (isPublic == false),
				published: {
					status: published_status,
					publicationDate: published_date
				},
				//owner:    [ ],
				//operator: [ ],
				creationDate: creationDate,
				language: va_video.language,
				title: va_video.title,
				duration: va_video.duration * 60,
				source: {
					type: "polimedia",
					live: false,
					masters:{
						repository: catalog.defaultRepositoryForMasters,
						files: []
					},
				},
				unprocessed: true,
				pluginData: {
					videoapuntes: {
						requestedBy: null,
						selectedAudio: selectedAudio,
						streaming: va_video.streaming,
						schoolroom: va_video.schoolroom
//						recordedByAgent: ""
//						recordedStatus: "",
					}
					
				},
				permissions: []
			};
		
			if (sakai_code) {
				video.pluginData.sakai = { codes: [sakai_code] };
			}
			
			var p_owner, p_presenter;
			
			p_owner = getOrCreateUser({
				name: va_owner.name,
				lastName: va_owner.lastName,
				email: va_owner.email
			});
			
			p_presenter = p_owner.then(function(){
				return getOrCreateUser({
					name: va_owner.name,
					lastName: va_owner.lastName,
					email: va_owner.email
				});
			});
			
			Q.all([p_owner,p_presenter])
			.spread(
				function(o, p) {
					video.owner = [p._id];
					video.pluginData.videoapuntes.requestedBy = o._id;
					var v = new Video(video);
					v.save(function(err){
						if (err) { return deferred.reject();}
						v.updateSearchIndex();
						deferred.resolve(v);
					});
				},
				function() {deferred.reject()}
			);
		});
	})
	.catch(	function(err) { deferred.reject(err);})
	
	return deferred.promise;
}

function getVideoMastersPath(videoId) {
	var deferred = Q.defer();	
	
	Video.findOne({_id:videoId})
	.select("catalog source.masters.repository")
	.populate("source.masters.repository")
	.populate("catalog")
	.exec(function(err, video){
		if (err) { return res.sendStatus(500); }
		Video.populate(video, {path: 'catalog.defaultRepositoryForMasters', model:"Repository"}, function(err, video){					
			if (err) { return deferred.reject(500); }
			
			if (video) {
				var mastersPath
				try {
					mastersPath = video.catalog.defaultRepositoryForMasters.path;
					deferred.resolve({video: video._id, path: mastersPath});
				}
				catch(e) { 
					deferred.reject(500);
				}
			}
			else {
				deferred.reject(404);
			}
		});
	});	
	
	return deferred.promise;	
}


exports.routes = {
	masterPath: {
		post: [ //post
			AuthController.CheckRole(['ADMIN']),		
			function(req, res) {
				getVideoMastersPath(req.params.id)
				.then(
					function(path) { res.send(path); },
					function(err) {
						if (err == 404) {
							createVideoFromVideoApuntes(req.params.id)
							.then(
								function(video) { 
									getVideoMastersPath(video._id)
									.then(
										function(path) { res.send(path); }, 
										function(err) { res.sendStatus(err || 500);}
									)
								},
								function(err) { res.sendStatus(err || 500); }
							)						
						}
						else {
							res.sendStatus(err || 500);
						}
					}
				);
			}			
		]
	}
}
