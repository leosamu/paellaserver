
paella.dataDelegates.MediaServiceTrimmingDataDelegate = Class.create(paella.DataDelegate, {
	read:function(context,params,onSuccess) {
		var episodeId = params.id;
		
		var ajaxObj = jQuery.ajax({
			url: '/rest/video/'+episodeId+'/trimming',
			cache: false,
			type: 'GET',
			dataType: 'json',
		})
		.done(function(data){
			if (data){
				onSuccess({start: data.start, end: data.end}, true);				
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

		var ajaxObj = jQuery.ajax({
			url: '/rest/video/'+episodeId+'/trimming',
			cache: false,
			type: 'PATCH',
			dataType: 'json',
			contentType : 'application/json; charset=utf-8',
			data: JSON.stringify({start:value.start, end:value.end})
		})
		.done(function(data){
			onSuccess({start:value.start, end:value.end}, true);	
		})
		.fail(function(error){
			onSuccess(undefined, false);
		});
	},
	
	remove:function(context,params,value,onSuccess) {
		var episodeId = params.id;
		
		var ajaxObj = jQuery.ajax({
			url: '/rest/video/'+episodeId+'/trimming',
			cache: false,
			type: 'DELETE',
			dataType: 'json'
		})
		.done(function(data){
			onSuccess(undefined, true);				
		})
		.fail(function(error){
			onSuccess(undefined, false);
		});
	}
});
