
paella.dataDelegates.MediaServiceBreksDataDelegate = Class.create(paella.DataDelegate, {
	read:function(context,params,onSuccess) {
		var episodeId = params.id;
		
		var ajaxObj = jQuery.ajax({
			url: '/rest/video/'+episodeId+'/breaks',
			cache: false,
			type: 'GET',
			dataType: 'json',
		})
		.done(function(data){
			var breaks = [];
			data.forEach(function(b, i){
				breaks.push({id:i, s:b.start, e:b.end});
			})
			onSuccess({breaks: breaks}, true);				
		})
		.fail(function(error){
			onSuccess(undefined, false);
		});
	},
	
	write:function(context,params,value,onSuccess) {
		var episodeId = params.id;

		var breaks = [];
		value.breaks.forEach(function(b){
			breaks.push({start:b.s, end: b.e})
		})

		var ajaxObj = jQuery.ajax({
			url: '/rest/video/'+episodeId+'/breaks',
			cache: false,
			type: 'PATCH',
			dataType: 'json',
			contentType : 'application/json; charset=utf-8',
			data: JSON.stringify(breaks)
		})
		.done(function(data){
			onSuccess(breaks, true);	
		})
		.fail(function(error){
			onSuccess(undefined, false);
		});
	},
	
	remove:function(context,params,value,onSuccess) {
		var episodeId = params.id;
		
		var ajaxObj = jQuery.ajax({
			url: '/rest/video/'+episodeId+'/breaks',
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
