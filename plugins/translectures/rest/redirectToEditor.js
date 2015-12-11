var crypto = require('crypto');
var VideoController = require(__dirname + '/../../../controllers/video');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	redirectToEditor: { param: 'id', get: [
		VideoController.LoadVideo,
		function(req,res,next) {
			var tlEditUrl = "https://fuster.cc.upv.es/player-pm";
			var tlPasswd = "pM46021";
			
			var userId = "anonymous";
			var userName = "Anonymous";
			var tlConf = 0;
			var lang = req.query.lang;
			if (req.isAuthenticated()) {
				userId = req.user._id;
				userName = req.user.contactData.lastName + ", " + req.user.contactData.name;
				var isOwner = false;
				var isRevisor = false;
				try {
					isOwner = req.data[0].owner.some(function(o){ return (o == userId); });
					isRevisor = req.user.roles.some(function(r){ return (r._id == "TRANSLECTURES_REVISOR"); })
				}
				catch(e){}
				
				if (isOwner || isRevisor) {
					tlConf = 100;
				}
				else {
					tlConf = 50;
				}
			}
			
			var expire = new Date();
			expire.setDate(expire.getDate()+10);
			var json = {
				tlid: req.params.id,
				tldb: "pm",
				tlbaseurl: "https://fuster.cc.upv.es/player-pm/data/pm/data",
				tllang: lang,
				tluserid: userId,
				tlusername: userName,
				tlconf: tlConf,
				tlexpire: expire.getTime()
			};
			var jsonSTR = JSON.stringify(json);
			var jsonBuffer = new Buffer(jsonSTR);
			var json64 = jsonBuffer.toString('base64');
			
			var shasum = crypto.createHash('sha1');
			var passjson64 = tlPasswd + json64;
			shasum.update(passjson64);
			jsonSHA1 = shasum.digest('hex');						
			

			var redirectEditor = tlEditUrl + "?tldata="+encodeURIComponent(json64)+"&tlkey="+encodeURIComponent(jsonSHA1);
			res.redirect(302, redirectEditor)					
			//res.json({lang: req.query.lang, data: req.data, user: req.user, redirectEditor: redirectEditor});
		}]
	}
}
