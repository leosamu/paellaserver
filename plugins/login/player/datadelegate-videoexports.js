
paella.dataDelegates.MediaServiceVideoExportsDataDelegate = Class.create(paella.DataDelegate, {
	read:function(context,params,onSuccess) {
		var episodeId = params.id;
		
		var ajaxObj = jQuery.ajax({
			url: '/rest/video/'+episodeId+'/videoexports',
			cache: false,
			type: 'GET',
			dataType: 'json',
		})
		.done(function(data){
			if (data){
				data.forEach(function(ve){
					if (ve.slices) {
						ve.slices.forEach(function(s,i){
							s.id = i;
						});
					}
				});
				onSuccess(data, true);
			}
			else {
				onSuccess(undefined, false);
			}
		})
		.fail(function(error){
			onSuccess(undefined, false);
		});
	},
	
	write:function(context,params,value,onSuccess) {
		var episodeId = params.id;
		var promises = [];
		
		value.forEach(function(v) {
			if (v.changed == true) {
				var p;
				
				if (v.isNew == true) {
					p = jQuery.ajax({
						url: '/rest/video/'+episodeId+'/videoexports',
						cache: false,
						type: 'POST',
						dataType: 'json',
						contentType : 'application/json; charset=utf-8',
						data: JSON.stringify(v)
					})
					.done(function(res) {
						v._id = res._id;
						v.isNew = false;
						v.changed = false;
					});
				}
				else {
					p = jQuery.ajax({
						url: '/rest/video/'+episodeId+'/videoexports/' + v._id,
						cache: false,
						type: 'PATCH',
						dataType: 'json',
						contentType : 'application/json; charset=utf-8',
						data: JSON.stringify(v)
					})
					.done(function(res) {
						v.changed = false;
					});					
				}
				promises.push(p);	
			}
		});
		
		jQuery.when.apply(jQuery, promises)
		.done(function(){
			onSuccess(undefined, true);
		})
		.fail(function() {
			onSuccess(undefined, false);
		});
	},
	
	remove:function(context,params,value,onSuccess) {
		onSuccess(undefined, false);
	}
});
