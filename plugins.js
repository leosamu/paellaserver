const util = require('util');
var fs = require('fs');


function findPluginsFolders() {
	var folders = [];
	
	var dirs = fs.readdirSync(__dirname+'/plugins');
	dirs.forEach(function(pluginName) {
		folders.push(__dirname+'/plugins/'+pluginName)
	});

	return folders;
}


function loadPlugins(folders) {

	if (folders == null) {
		folders = findPluginsFolders();
	}
	if ( util.isString(folders) == true) {
		folders = [folders];
	}

	folders.forEach(function(folder){
		var f = folder + '/server/index.js';
		if (fs.existsSync(f)) {
			require(f);
		}
	});
}



module.exports.findPluginsFolders = findPluginsFolders;
module.exports.loadPlugins = loadPlugins;