var qs = require('querystring');
function parseReq(req,res,next){
	var body = '';
	var obj;
	req.on('data',function(data){
		body+=data;
	});
	req.on('end',function(){
		obj = qs.parse(body);
		req.bodyData = obj; 
		next();
	});
}
module.exports.parseReq = parseReq;