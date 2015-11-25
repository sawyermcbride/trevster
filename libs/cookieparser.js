
// Cookie Parser for express.js
// By Sawyer McBride
// September 2015
function parse(req,res,next){
	var cookies = cookies || {};
	if(!req.headers.cookie){
		req.cookieData = 0;
		next();
	}else{
		var split = req.headers.cookie.split(';');

		for(var i = 0;i<split.length;i++){
			var insert = split[i].split('=');
			
			cookies[insert[0]] = insert[1];
		}
		req.cookieData = cookies
		next();
	}
};

module.exports.parse = parse;