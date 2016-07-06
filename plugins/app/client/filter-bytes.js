(function() {
	var app = angular.module('paellaserver');

	app.filter('bytesToHuman', function() {
	
		function humanFileSize(bytes, si) {
		    var thresh = si ? 1000 : 1024;
		    if(Math.abs(bytes) < thresh) {
		        return bytes + ' B';
		    }
		    var units = si
		        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
		        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
		    var u = -1;
		    do {
		        bytes /= thresh;
		        ++u;
		    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
		    return bytes.toFixed(1)+' '+units[u];
		}	
	
	
		return function(bytes) {
			if (!bytes) {
				return "-"
			}
			
			return humanFileSize(bytes, false);
		};
	});	
	
	
	app.filter('secondsToHuman', function() {
	
		var secondsTohhmmss = function(totalSeconds) {
			var hours   = Math.floor(totalSeconds / 3600);
			var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
			var seconds = Math.ceil(totalSeconds - (hours * 3600) - (minutes * 60));
			
			// round seconds
			seconds = Math.round(seconds * 100) / 100
			
			var result = (hours < 10 ? "0" + hours : hours);
			  result += ":" + (minutes < 10 ? "0" + minutes : minutes);
			  result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
			return result;
		}	
	
	
		return function(seconds) {
			if (!seconds) {
				return "-"
			}
			
			return secondsTohhmmss(seconds);
		};
	});	
	
	
	
})();