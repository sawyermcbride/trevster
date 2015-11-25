/*Server for Tresvter
	By Sawyer McBride
	September 2015
*/

//Include node modules
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;


var DB;
//MONGO Init
var url = "mongodb://localhost:27017/Trevster";
mongoClient.connect(url,function(err,db){
	if(err)throw new Error()

	console.log("CONNECTED to db")
	//make db available throughout
	DB = db;
});


function onRequest(req,res){
	//variables
	var filePath = "",
		url = "",
		rootDir = "../public",
		extension,
		contentType,
		file;
	console.log("request");
	//Check for GET and Root url to server index.html
	if(req.method=="GET"){
		if(req.url=="/"){
			//create read stream with index.html
			file = fs.createReadStream("../public/index.html");

			res.writeHead(200,{"Content-Type":"text/html"});
			//pipe file to response
			file.pipe(res);
			//listen for end event to stop stream
			file.on('end',function(){
				res.end();
			});
		}else{
			//get requested path
			url = path.join(rootDir,""+req.url);
			fs.stat(url,function(err,stat){
				if(err){
					//if file does not exist send 404 not found
					if(err.code=="ENOENT"){
						//pass in response variable
						send404(res);
						console.log("error in file path");
					}

				}else{
					//get file extension to set content type
					extension = path.extname(url);

					//set correct content type of file
					switch(extension){
						case ".js":
							contentType = "application/javascript";
							break;
						case ".css":
							contentType = "text/css";
							break
						default:
						contentType = "text/html"
					}


					file = fs.createReadStream(url);
					res.writeHead(200,{"Content-Type":contentType});
					file.pipe(res);
					file.on('end',function(){
						res.end();
					})
				}//other content types
			});//If file exists
		}//else		
	}//GEt if statmente
	else{
		dataRequest(req,res);
	}
	
}//On Request

function send404(res){
	res.writeHead(404,{"Content-Type":"text/html"});
	res.write("<h1>Wrong Url</h1><h2>Page does not exist :(</h2>")
	res.end();
}

//On Post Request
function dataRequest(req,res){

}

function serverFiles(req,res){


}

http.createServer(onRequest).listen(3000,'0.0.0.0');




