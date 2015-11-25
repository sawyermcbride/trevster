var express = require('express');
var fs = require('fs');
var jade = require('jade');
var qs = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var db;

var cookies = require('./libs/cookieparser.js');

var app = express();

MongoClient.connect('mongodb://localhost:27017/Trevster',function(err,dbs){
	if(err){
		console.log(err);
	}else{
		db = dbs;
	}
});

app.use(cookies.parse);

app.get('/',function (req,res,next){
	// res.sendFile(__dirname+'/public/index.html')
	if(!req.cookieData.user){
		res.redirect('/login');
	}else{
		console.log(req.cookieData);
		var cursor = db.collection('users').find({username:req.cookieData.user}).toArray(function(err,docsa){
			app.locals.user = docsa[0];
			res.redirect('/home');
		});
	}
});
app.get('/join',function(req,res){
	res.sendFile(__dirname+'/public/join.html');
});
app.post('/join',function(req,res,next){

	parsePost(req,function(data){
		db.collection('users').find({'username':data.user}).toArray(function(err,docs){
			//if no user exists create new one
			if(docs.length<1){
				db.collection('users').insert({'username':data.user,'password':data.password,
					'tasks':[],'completedTasks':[],'deletedTasks':[]});

				res.redirect('/login');
			}else{
				res.send("ALREADY EXISTS");
			}
		});
	});
});

//Login
app.get('/login',function(req,res){
	res.sendFile(__dirname + '/public/login.html');
});

app.post('/login',function (req,res){
	parsePost(req,function(data){
		var cursor = db.collection('users').find({username:data.user}).toArray(function(err,docs){
			//if a user is found
			if(docs.length>0){
				console.log(docs[0]);
				if(docs[0]['password']==data.password){
					//store found document in app.locals object
					app.locals.user = docs[0]; 
					console.log(docs[0]);
					res.redirect('/home');
				}else{
					//if password does not match username
					res.send("DENIED");
				}
			}else{
				//if no user is found
				res.send("NO ACCOUNT FOUND");
			}
		});
	});
})
app.get('/home',function (req,res){
	//if no session is found
	if(!(req.cookieData.user)&& !(app.locals.user)){
		res.redirect('/');
	}else{
		var cursor = db.collection('users').find({username:req.cookieData.user}).toArray(function(err,doc){
			app.locals.user = doc[0];

	console.log(res.user);
	//set cookies of page with session data
	res.set({
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		'Pragma':'no-cache',
		'Set-Cookie': 'user='+app.locals.user.username,
	});
	console.log(app.locals.user.tasks[0]);
	//pass in objects to render with jade
	res.render(__dirname+'/views/home.jade',{
		username:app.locals.user.username,
		tasks:app.locals.user.tasks,
		date: currentDate()
	});
	res.end();
	console.log('new user');
		});
	}
});

app.post('/addtask',function (req,res,next){
	parsePost(req,function(data){
		console.log(data);
		db.collection('users').update(
			{'username':data.user},
			{$push: {tasks:data.task}}
		)
	})
});
app.post('/deletetask',function (req,res){
	parsePost(req,function(data){
		console.log('attempting to delete');
		var tasks;
		db.collection('users').find({'username':data.user}).toArray(function(err,docs){;
			tasks = docs[0].tasks;
			console.log(tasks);
			tasks.splice(data.index,1);
			console.log(tasks);
			db.collection('users').update({'username':data.user},{$set: {tasks:tasks}})
		});
	});
});
function currentDate(){
	var d = new Date()
	var months = ["Jan.", "Feb.","March","April","May", "June", "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
	var days = ["Sunday","Monday", "Tuesday","Wednesday","Thursday","Friday", "Saturday"];

	return days[d.getDay()]+" "+months[d.getMonth()]+" "+d.getDate()+"th";

}


//Retuns object of parsed post request
function parsePost(req,cb){
	var body = '';
	var obj;
	req.on('data',function(data){
		body+=data;
	});
	req.on('end',function(){
		obj = qs.parse(body);
		cb(obj); 
	});
}

//Static Files
app.use(express.static(__dirname+'/public'))

app.listen(80,'0.0.0.0');

console.log('API RUNNING');

//Middleware