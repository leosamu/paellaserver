paella.plugins.MultipleVideoExportEditorPlugin = Class.create(paella.editor.TrackPlugin, {
	tabContainer: null,
	videoExports: [],
	selectedVideoExport: null,
	selectedTrackItem:null,	


	getName:function() {
		return "es.upv.paella.mediaserver.editor.videoExportsPlugin";
	},
	
	getTrackName:function() {
		return paella.dictionary.translate("Video exports");
	},
	
	getColor:function() {
		return 'rgb(176, 214, 118)';
	},
	
	getTextColor:function() {
		return 'rgb(90,90,90)';
	},

	checkEnabled:function(onSuccess) {
		onSuccess(true);		
	},

	setup:function() {
		var self = this;
		paella.events.bind(paella.events.showEditor, function(){
			self.onRead(function(){
				paella.events.trigger(paella.events.documentChanged);
			});
		});	
	},	
	
	getTrackItems:function() {
		var tracks = [];
		if (this.selectedVideoExport) {
			var title = this.selectedVideoExport.meta.title;
			this.selectedVideoExport.slices.forEach(function(slice){
				tracks.push({id:slice.id, s:slice.start, e:slice.end, name:title});
			});
		}
		return tracks;
	},
	
	getTools:function() {
		return [
			{name:'create',label:paella.dictionary.translate('Create'),hint:paella.dictionary.translate('Create a new track item in the current position')},
			{name:'delete',label:paella.dictionary.translate('Delete'),hint:paella.dictionary.translate('Delete selected track item')}
		];
	},

	getVideoExportUniqueId:function() {
		var newId = 0;
		this.videoExports.forEach(function(ve){
			if (ve.isNew == true) {
				if (newId <= ve._id) {
					newId = ve._id + 1;
				}				
			}			
		});
		return newId;
	},	
	
	getTrackUniqueId:function() {
		var newId = -1;
		if (this.selectedVideoExport) {
			if (this.selectedVideoExport.slices.length==0) return 1;
			this.selectedVideoExport.slices.forEach(function(slice){
				if (newId <= slice.id) {
					newId = slice.id + 1;
				}				
			});
		}
		return newId;
	},		
			
	onToolSelected:function(toolName) {
		if (!this.selectedVideoExport) {
			alert(paella.dictionary.translate('Select or create a new video export first'));		
		}
		else {
			if (this.selectedVideoExport.status != "editing") {
				alert(paella.dictionary.translate('You can not modify the video export settings'));
			}
			else{
				switch (toolName) {
					case 'delete':
						if (this.selectedTrackItem) {
							this.selectedVideoExport.slices.splice(this.selectedVideoExport.slices.indexOf(this.selectedTrackItem),1);
							paella.events.trigger(paella.events.documentChanged);
							return true;
						}
						break;						
					case 'create':
						if (this.isCurrentPositionInsideATrackItem() == false) {
							var start = paella.player.videoContainer.currentTime();
							var itemDuration  = paella.player.videoContainer.duration()*0.1;
							itemDuration = itemDuration*100/paella.editor.instance.bottomBar.timeline.zoom;
							var end = start + itemDuration;
							if (end > paella.player.videoContainer.duration() ) { end = paella.player.videoContainer.duration(); }
														
							for (var i=0; i<this.selectedVideoExport.slices.length; ++i) {
								var slice = [i];
								if ( (slice.start>start) && (slice.start<end) ) {
									end = slice.start;
								}
							}				
							
							var id = this.getTrackUniqueId();
							this.selectedVideoExport.slices.push({id:id, start:start, end:end});							
							paella.events.trigger(paella.events.documentChanged);
						}
						else{
							alert (paella.dictionary.translate("Can not create a new video segment inside a segment"));
						}						
						return true;
				}
			}
		}
	},

	isCurrentPositionInsideATrackItem: function(){
		var point = paella.player.videoContainer.currentTime();		
		var startInsideTrackItem = this.selectedVideoExport.slices.some(function(slice){
			return ((slice.start <= point) && (point <= slice.end));			
		});
		return startInsideTrackItem;		
	},
	
	isToolEnabled:function(toolName) {
		switch (toolName) {
			case 'create': 
				return (this.isCurrentPositionInsideATrackItem() == false); 
				
			case 'delete': 
				if (this.selectedTrackItem)
					return true;
				break;
				
			default:
				return true;
		}
		return false;		
	},

	buildCommonContent: function() {
		var self = this;
		var root = document.createElement('div');
		root.className = "form-group form-group-sm";
		
		var label =  document.createElement('label');
		label.className = "col-sm-2 control-label";
		label.innerHTML = "Videoexport to edit:";
		
		var divSelect = document.createElement('div'); 
		divSelect.className= "col-sm-10";
		
		var select = document.createElement('select');
		select.className = "form-control";
		$(select).change(function(v){
			var selectedId = $(select).val();
			self.changeVideoExportToId(selectedId);
		})
		divSelect.appendChild(select);
		
		
		// 'editing', 'sendedToProcess', 'processing', 'processed'
		var opts = {};		
		opts['editing'] = document.createElement('optgroup');
	    opts['editing'].label = "Editing";
		opts['sendedToProcess'] = document.createElement('optgroup');
		opts['sendedToProcess'].label = "Sended to process";
		opts['processing'] = document.createElement('optgroup');
		opts['processing'].label = "Processing";
		opts['processed'] = document.createElement('optgroup');
		opts['processed'].label = "Processed";
				
		this.videoExports.forEach(function(e){
			var option = document.createElement('option');
			option.value = e._id;
			option.innerText = ((e.changed==true) ? "(*) " : "" ) + e.meta.title;
			
			var optgrp = opts[e.status];
			if (optgrp) {
				optgrp.appendChild(option);
			}
		});
		if (opts['editing'].childNodes.length > 0) {select.appendChild(opts['editing']);}
		if (opts['sendedToProcess'].childNodes.length > 0) {select.appendChild(opts['sendedToProcess']);}
		if (opts['processing'].childNodes.length > 0) {select.appendChild(opts['processing']);}
		if (opts['processed'].childNodes.length > 0) {select.appendChild(opts['processed']);}

		if (select.childNodes.length == 0) {
			var option = document.createElement('option');
			option.value = "";
			option.innerText = "Select a saved video export";		
			select.appendChild(option);
		}

		if (this.selectedVideoExport) {
			$(select).val(this.selectedVideoExport._id);
		}
		else {
			$(select).val("");
		}

		root.appendChild(label);
		root.appendChild(divSelect);

		var buttons = document.createElement('div');
		buttons.className="btn-group";
		var btn1 = document.createElement('button');
		btn1.className="btn btn-mini";
		//btn1.title = "Create a new track item in the current position";
		btn1.innerText = "Create";
		$(btn1).click(function() {		
			var title = prompt("Please enter the title of the new video", "Title of the new video");		
		
			var newId = self.getVideoExportUniqueId()
			self.videoExports.push({
				_id: newId,
				slices: [],
				meta: { title: title },
				status: "editing", // 'editing', 'sendedToProcess', 'processing', 'processed'
				isNew: true,
				changed: true
			});
			self.changeVideoExportToId(newId);
			paella.events.trigger(paella.events.documentChanged);
		});		
		buttons.appendChild(btn1);

		var btn2 = document.createElement('button');
		btn2.className="btn btn-mini";
		//btn2.title = "Create a new track item in the current position";
		btn2.innerText = "Delete";
		$(btn2).click(function() {
			if (self.selectedVideoExport) {
				if (self.selectedVideoExport.isNew) {
					self.videoExports.splice(self.videoExports.indexOf(this.selectedVideoExport),1);
					self.changeVideoExportToId(null);
				}
				paella.events.trigger(paella.events.documentChanged);
			}
		});
		buttons.appendChild(btn2);
		

		root.appendChild(buttons);
		return root;
	},
	
	
	
	buildEditingContent: function() {
		var self = this;
		var root = document.createElement('div');

		var message = document.createElement('strong');
		message.innerHTML = "Titulo del nuevo video a exportar"; 

		var input = document.createElement('input');
		input.className = "form-control";
		input.type = "text";
		input.value = this.selectedVideoExport.meta.title;
		$(input).change(function(){
			self.selectedVideoExport.meta.title = input.value;
			self.selectedVideoExport.changed = true;
			self.rebuildToolTabContent();
			paella.events.trigger(paella.events.documentChanged);
		});

		var buttons = document.createElement('div');
		buttons.className="btn-group";

		var btn = document.createElement('button');
		btn.className="btn btn-mini";
		//btn2.title = "Create a new track item in the current position";
		btn.innerText = "Send to process";
		$(btn).click(function() {
			if (self.selectedVideoExport) {
				self.selectedVideoExport.status = "sendedToProcess";
				self.selectedVideoExport.changed = true;
				self.rebuildToolTabContent();
				paella.events.trigger(paella.events.documentChanged);
			}
		});
		buttons.appendChild(btn);

		root.appendChild(message);
		root.appendChild(input);
		root.appendChild(buttons);
	
		return root;
	},	
	
	
	buildSendedToProcessContent: function() {
	var self = this;
		var root = document.createElement('div');
		
		var message = document.createElement('strong');
		message.innerHTML="Your request is queued for processing."; 

		var message2 = document.createElement('div');
		message2.innerHTML ="Your video will be processed as soon as possible. If you want you can cancel this request.";
		
		
		var buttons = document.createElement('div');
		buttons.className="btn-group";

		var btn1 = document.createElement('button');
		btn1.className="btn btn-mini";
		btn1.title = "Cancel your request";
		btn1.innerText = "Cancel";
		$(btn1).click(function() {
			if (self.selectedVideoExport) {
				self.selectedVideoExport.status = "editing";
				self.selectedVideoExport.changed = true;
				self.rebuildToolTabContent();
				paella.events.trigger(paella.events.documentChanged);
			}
		});
		
		buttons.appendChild(btn1);
		
		root.appendChild(message);
		root.appendChild(message2);
		root.appendChild(buttons);
		return root;
	},	
	
	buildProcessingContent: function() {
		var root = document.createElement('div');
		
		var message = document.createElement('strong');
		message.innerHTML="Your request is being processed at this time."; 

		var message2 = document.createElement('div');
		message2.innerHTML ="Your video will be available soon.";
		
		root.appendChild(message);
		root.appendChild(message2);
		return root;
	},		
		
	buildProcessedContent: function() {
		var root = document.createElement('div');
		
		var message = document.createElement('strong');
		message.innerHTML="Your request has been procesed."; 

		var link = document.createElement('div');
		var url = "https://media.upv.es/player/?id=" + this.selectedVideoExport.videoIdGenerated;
		link.innerHTML ="<a href='" + url + "'>"+ url + "</a>";
		
		root.appendChild(message);
		root.appendChild(link);
		return root;
	},		
	
	buildToolTabContent:function(tabContainer) {
		this.tabContainer = tabContainer;
		
		this.rebuildToolTabContent();
	},
	
	rebuildToolTabContent: function() {		
		var common = this.buildCommonContent();
		
		var hr = document.createElement('div');		
		hr.innerHTML = '<hr/>'

		
		var detail;
		
		if (this.selectedVideoExport) {
			// 'editing', 'sendedToProcess', 'processing', 'processed'
			if (this.selectedVideoExport.status == "editing") {
				detail = this.buildEditingContent();
			}
			else if (this.selectedVideoExport.status == "sendedToProcess") {
				detail = this.buildSendedToProcessContent();
			}
			else if (this.selectedVideoExport.status == "processing") {
				detail = this.buildProcessingContent();
			}
			else if (this.selectedVideoExport.status == "processed") {
				detail = this.buildProcessedContent();
			}
			else {
				detail = document.createElement('div');
				detail.innerHTML="Error"
			}
		}
		else {
			detail = document.createElement('div');
			detail.innerHTML="You must select a video export to edit or create a new one."
		}


		this.tabContainer.innerHTML="";
		this.tabContainer.appendChild(common);
		this.tabContainer.appendChild(hr);
		this.tabContainer.appendChild(detail);
	},
	
	changeVideoExportToId: function(newId) {
		var self = this;
		this.selectedVideoExport = null;
		this.selectedTrackItem = null;
		this.videoExports.some(function(e){
			if (e._id == newId) {
				self.selectedVideoExport = e;
				console.log(self.selectedVideoExport);
				return true;
			}
			return false;
		});
		paella.events.trigger(paella.events.documentChanged);
		this.rebuildToolTabContent();		
	},
	

	onTrackChanged:function(id, start, end) {
		if ((!this.selectedVideoExport) || (this.selectedVideoExport.status != "editing")) {
			return true;
		}
		var joinTracks = true;

		var item = null;
		this.selectedVideoExport.slices.some(function(slice){
			if (slice.id==id) {
				item = slice;
				return true;
			}
			return false;			
		});
		this.selectedTrackItem = item;

		if (item) {
			if (start < 0) {start = 0;}
			if (end > paella.player.videoContainer.duration() ) { end = paella.player.videoContainer.duration(); }			
			
			//check for cancel
			for (i=0; i<this.selectedVideoExport.slices.length; ++i) {
				if (this.selectedVideoExport.slices[i].id != id) {
					if ( (this.selectedVideoExport.slices[i].start <= start) && (this.selectedVideoExport.slices[i].end >= end) ){
						return;
					}
					if ( (this.selectedVideoExport.slices[i].start >= start) && (this.selectedVideoExport.slices[i].end <= end) ){
						return;
					}
				}
			}

			// check for overlap
			for (i=0; i<this.selectedVideoExport.slices.length; ++i) {
				if (this.selectedVideoExport.slices[i].id != id) {
					if ( (this.selectedVideoExport.slices[i].start < start) && (this.selectedVideoExport.slices[i].end > start) ){
						if (joinTracks == null) {
							joinTracks = confirm (paella.dictionary.translate("Join Tracks?"));
						}
						if (joinTracks){
							this.selectedVideoExport.slices[i].end = end;
							this.selectedVideoExport.slices.splice(this.selectedVideoExport.slices.indexOf(item), 1);
							return;								
						}
						else{
							start = this.selectedVideoExport.slices[i].end;
						}
					}
					if ( (this.selectedVideoExport.slices[i].start < end) && (this.selectedVideoExport.slices[i].end > end) ){
						if (joinTracks == null) {
							joinTracks = confirm (paella.dictionary.translate("Join Tracks?"));
						}
						if (joinTracks){
							this.selectedVideoExport.slices[i].start = start;
							this.selectedVideoExport.slices.splice(this.selectedVideoExport.slices.indexOf(item), 1);
							return;								
						}
						else {
							end = this.selectedVideoExport.slices[i].start;
						}
					}	
				}			
			}
			
			item.start = start;
			item.end = end;
			this.selectedVideoExport.changed = true;
			paella.events.trigger(paella.events.documentChanged);			
		}
	},
			
	allowEditContent:function() {
		return false;
	},

	contextHelpString:function() {
		if (paella.utils.language()=="es") {
			return "";
		}
		else {
			return "";
		}
	},
	
	onRead:function(onComplete) {
		var self = this;
		paella.data.read('videoExports', {id:paella.initDelegate.getId()}, function(data, status) {
			self.videoExports = [];
			if (data) {
				self.videoExports = data;
				if (data.length > 0) {
					self.selectedVideoExport= data[0];
				}
			}
			onComplete(status);
		});
	},
	
	onSave:function(onComplete) {
		var self = this;
		paella.data.write('videoExports', {id:paella.initDelegate.getId()}, this.videoExports, function(response, status) {
			onComplete(status);
			self.rebuildToolTabContent();
		});
	}
});

paella.plugins.multipleVideoExportEditorPlugin = new paella.plugins.MultipleVideoExportEditorPlugin();

