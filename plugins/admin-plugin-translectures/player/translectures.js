

Class ("paella.captions.media.translectures.Caption", paella.captions.Caption, {
	initialize: function(id, format, url, lang, editURL, next) {
		this.parent(id, format, url, lang, next);
		this._captionsProvider = "mediaTranslecturesCaptionsProvider";
		this._editURL = editURL;		
	},
	
	canEdit: function(next) {
		// next(err, canEdit)
		next(false, ((this._editURL != undefined)&&(this._editURL != "")));
	},
	
	goToEdit: function() {		
		var self = this;
		paella.player.auth.userData().then(function(userData){
			if (userData.isAnonymous == true) {
				self.askForAnonymousOrLoginEdit();
			}
			else {
				self.doEdit();
			}		
		});	
	},
		
	doEdit: function() {
		window.location.href = this._editURL;		
	},
	doLoginAndEdit: function() {
		paella.player.auth.login(this._editURL);
	},
	
	askForAnonymousOrLoginEdit: function() {
		var self = this;

		var messageBoxElem = document.createElement('div');
		messageBoxElem.className = "translecturesCaptionsMessageBox";

		var messageBoxTitle = document.createElement('div');
		messageBoxTitle.className = "title";
		messageBoxTitle.innerHTML = base.dictionary.translate("You are trying to modify the transcriptions, but you are not Logged in!");		
		messageBoxElem.appendChild(messageBoxTitle);

		var messageBoxAuthContainer = document.createElement('div');
		messageBoxAuthContainer.className = "authMethodsContainer";
		messageBoxElem.appendChild(messageBoxAuthContainer);

		// Anonymous edit
		var messageBoxAuth = document.createElement('div');
		messageBoxAuth.className = "authMethod";
		messageBoxAuthContainer.appendChild(messageBoxAuth);

		var messageBoxAuthLink = document.createElement('a');
		messageBoxAuthLink.href = "#";
		messageBoxAuthLink.style.color = "#004488";
		messageBoxAuth.appendChild(messageBoxAuthLink);

		var messageBoxAuthLinkImg = document.createElement('img');
		messageBoxAuthLinkImg.src = "resources/style/caption_mlangs_anonymous.png";
		messageBoxAuthLinkImg.alt = "Anonymous";
		messageBoxAuthLinkImg.style.height = "100px";
		messageBoxAuthLink.appendChild(messageBoxAuthLinkImg);

		var messageBoxAuthLinkText = document.createElement('p');
		messageBoxAuthLinkText.innerHTML = base.dictionary.translate("Continue editing the transcriptions anonymously");
		messageBoxAuthLink.appendChild(messageBoxAuthLinkText);

		$(messageBoxAuthLink).click(function() {
			self.doEdit();
		});

		// Auth edit
		messageBoxAuth = document.createElement('div');
		messageBoxAuth.className = "authMethod";
		messageBoxAuthContainer.appendChild(messageBoxAuth);

		messageBoxAuthLink = document.createElement('a');
		messageBoxAuthLink.href = "#";
		messageBoxAuthLink.style.color = "#004488";
		messageBoxAuth.appendChild(messageBoxAuthLink);

		messageBoxAuthLinkImg = document.createElement('img');
		messageBoxAuthLinkImg.src = "resources/style/caption_mlangs_lock.png";
		messageBoxAuthLinkImg.alt = "Login";
		messageBoxAuthLinkImg.style.height = "100px";
		messageBoxAuthLink.appendChild(messageBoxAuthLinkImg);

		messageBoxAuthLinkText = document.createElement('p');
		messageBoxAuthLinkText.innerHTML = base.dictionary.translate("Log in and edit the transcriptions");
		messageBoxAuthLink.appendChild(messageBoxAuthLinkText);


		$(messageBoxAuthLink).click(function() {
			self.doLoginAndEdit();
		});

		// Show UI		
		paella.messageBox.showElement(messageBoxElem);
	}
});



Class ("paella.plugins.media.translectures.CaptionsPlugIn", paella.EventDrivenPlugin, {
		
	getName:function() { return "es.upv.paella.media.translecture.captionsPlugin"; },
	getEvents:function() { return []; },
	onEvent:function(eventType,params) {},


	checkEnabled: function(onSuccess) {
		var self = this;
		var video_id = paella.player.videoIdentifier;
		var vstr = paella.version.split(" ")[0];
		var version = vstr.split(".")

		if (parseInt(version[0]) < 5) {
			base.log.debug("Plugin " + self.getName() + " only works with paella 5");
			onSuccess(false);		
		}
		else {
			var langs_url = ('/rest/plugins/admin-plugin-translectures/langs/${videoId}').replace(/\$\{videoId\}/ig, video_id);
			base.ajax.get({url: langs_url},
				function(data, contentType, returnCode, dataRaw) {	
							
					if (data.length > 0) {
						data.forEach(function(l){
							var l_get_url = ("/rest/plugins/admin-plugin-translectures/dfxp/${videoId}/${tl.lang.code}")
								.replace(/\$\{videoId\}/ig, video_id)
								.replace(/\$\{tl.lang.code\}/ig, l.lang);
														
							var l_edit_url;							
	
							l_edit_url = ("/rest/plugins/admin-plugin-translectures/redirectToEditor/${videoId}/${tl.lang.code}")
								.replace(/\$\{videoId\}/ig, video_id)
								.replace(/\$\{tl.lang.code\}/ig, l.lang);
							
							var l_txt = l.label;
				            switch(l.transcription){
						    	case 'automatic':
						    		l_txt += " (" + paella.dictionary.translate("Auto") + ")";
						    		break;
						    	case 'manual':
						    		l_txt += " (" + paella.dictionary.translate("Manual") + ")";
						    		break;
						    	case 'partially':
						    		l_txt += " (" + paella.dictionary.translate("Under review") + ")";
						    		break;
						    }
														
							var c = new paella.captions.media.translectures.Caption(l.lang , "dfxp", l_get_url, {code: l.lang, txt: l_txt}, l_edit_url);
							paella.captions.addCaptions(c);
						});
						onSuccess(false);
					}
					else {
						base.log.debug("Error getting available captions from translectures: " + langs_url);
						onSuccess(false);
					}
				},						
				function(data, contentType, returnCode) {
					base.log.debug("Error getting available captions from translectures: " + langs_url);
					onSuccess(false);
				}
			);
		}
	}
});


new paella.plugins.media.translectures.CaptionsPlugIn();