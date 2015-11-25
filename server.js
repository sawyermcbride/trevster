/*
 * Sawyer McBride Sep. 2015
 *
 * trevster.com
 * Intelligent Todo List
 *
 *
 */


var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var sessions = require('client-sessions');
//Custom cookie and post parser middleware
var cookies = require('./libs/cookieparser.js');
var body = require('./libs/body.js');

//module for getting current dateA
var date = require('./libs/date.js');

var db;
var app = express();
var wigets = require('./routes/wigets.js')(app);
//Connect to database
MongoClient.connect('mongodb://localhost:27017/Trevster',function (err,database) {
	if(null!==err){
		console.log("Error Connecting database");

	}else{
		console.log("Connected to mongodb@27017");

		//make database available throughout app
		db = database;
	}
});


//set rendering engine and location of views for express (app.render())

app.set('views','./views');
app.set('view engine','jade')
app.locals.pretty = true;

//middleware
app.use(cookies.parse);
app.use(body.parseReq);
//storing encrypted cookies with mozillas cliebt-sessions middleware
app.use(sessions({
	cookieName: 'session',
	secret: '5d4fg846dfxxxs4g61dsb51864h8j4d6',
	duration: 1000*60*60*24*7,
	activeDuration:5*60*1000
}));


//authentication middleware that runs on every request
app.use(function(req,res,next){
	console.log('connected');
	//If cookie exists then attempt to restore users session else redirect to login page
	if(req.session && req.session.user){
		db.collection('users').findOne({'username':req.session.user.username},function(err,doc){
			if(doc==null){
				res.redirect('/login');
			}else{
				//If password of user matches session password
				if(req.session.user.password==doc.password){
					req.session.user = doc;
					app.locals.user = doc;
					//After loading session, go to next middleware
					next();
				}
			}
		});
	}else{
		next();
	}
});
app.get('/',function (req,res) {
	//If session exists, restore it.
	if(req.session.user&&app.locals.user){
		res.redirect('/home');
	}
	res.sendFile(__dirname+'/public'+'/index.html');
});

app.get('/join',function(req,res){
	res.render('join');
});

app.get('/login',function(req,res){
	res.render('login')
});


app.post('/login',function(req,res){
	//query for username
	db.collection('users').findOne({'username':req.bodyData.username},function(err,doc){
		console.log(err);
		if(doc==null){
			res.render('login.jade',{error:'Account Not Found'});
		}else{
			if(req.bodyData.password==doc.password){
				req.session.user = doc;
				app.locals.user = doc;
				res.redirect('/home');
			}else{
				res.render('login.jade',{error:'Wrong Password'});
			}
		}
	});

});
app.post('/join',function(req,res){
	db.collection('users').findOne({'username':req.bodyData.username},function(err,doc){
		if(doc!=null){
			res.render('join',{error:'You aready have an account, please login!'})
		}else{
			db.collection('users').insert()
		}
	});
});

app.get('/signout',function(req,res){
	req.session.reset();
	res.redirect('/');
});


//Call 'authenticate' middleware to restore users session or redirect to home 

app.get('/home',function(req,res){
	//if session exists and user session has been authenticated
	if(req.session.user&&app.locals.user){
		app.locals.user.date = date.getDate();
		res.render('home.jade',app.locals.user);
	}else{
		res.redirect('/login');
	}
});
app.post('/addtask',function(req,res){
	db.collection('users').update(
		{'username':app.locals.user.username},
		{$push: {tasks:req.bodyData.task}}
	);
	res.sendStatus(200);
});

//remove task on method
app.delete('/task/:method',function(req,res){
		//delete from tasks array
		var tasks = app.locals.user.tasks;
		//store deleted task in var for future use
		var splicedTask = tasks[req.bodyData.index];

		tasks.splice(req.bodyData.index,1);
		db.collection('users').update(
			{'username':app.locals.user.username},
			{$set: {tasks:tasks}}
		)
		//append to deletedTasks array or append to completeTasks array based on url params (to condense code)
		if(req.params.method=='delete'){
			//append to deleted tasks array
			db.collection('users').update(
				{'username':app.locals.user.username},
				{$push: {deletedTasks:splicedTask}}
			);
			res.sendStatus(200);
		}else if(req.params.method=='done'){
			db.collection('users').update(
				{'username':app.locals.user.username},
				{$push: {completedTasks:splicedTask}}
			);
			res.sendStatus(200);
		}
});

/**
	Return wigets in json format

*/

app.get('/search',function(req,res){
	if(req.session.user&&app.locals.user){
		var results = results || {};

		results.completed = [];
		results.current = [];
		results.deleted = [];

		var current = app.locals.user.tasks;
		var deleted = app.locals.user.deletedTasks;
		var completed = app.locals.user.completedTasks;

		//Set result object 
		results.current = current.filter(function(val){
			var input = val.toLowerCase();
			var term = req.query.term.toLowerCase();
			return input.indexOf(term)!=-1; 
		});


		results.deleted = deleted.filter(function(val){
			var input = val.toLowerCase();
			var term = req.query.term.toLowerCase();
			return input.indexOf(term)!=-1; 
		});


		results.completed = completed.filter(function(val){
			var input = val.toLowerCase();
			var term = req.query.term.toLowerCase();
			return input.indexOf(term)!=-1; 
		});
		res.json(JSON.stringify(results));	
	}else{
		res.redirect('/login');
	}
});
app.get('/wigets/get',wigets.render);
// middleware for servering static files
app.use(express.static(__dirname+'/public'));	

//if the 
app.get('*',function(req,res){
	res.render('404.jade');
});
//listen on port 80
app.listen(80,'0.0.0.0');

module.exports = app;
