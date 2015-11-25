
//Routes

//Custom Mongo Utlity
var db = require('../libs/db.js');
var jade = require('jade');
var fs = require('fs');
db.connect('mongodb://localhost:27017');

exports.home = function (res,req) {
	fs.readFile('./views/home.jade','utf-8',function(err,data){
		var fn = jade.compile(data);
		var html =  fn({
			username:"Jake West",
			taskNumber:5,
			date:"September 14th, 2015"
		});
		//console.log(html);
		res.writeHead(200,{"Content-Type":"text/html"});
		res.write("sawyer mcbride");
	});
}