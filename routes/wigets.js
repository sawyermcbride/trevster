 /**
 * By Sawyer McBride
 * Module to analyze tasks and return json
 * Uses custom NLP libs to complete
 *
 */
var assert = require('assert');
/**
 * Include custom NLP libraries
 * normalizer.js - and remove "junk"   
 * subjects.js - extract the subject and parts of the sentence "categorizer"
 */
var subjects = require('../libs/subjects.js')
var normalizer = require('../libs/normalizer.js');
/**
 * Global function that handles the http request and performs sub tasks
 */
var app;
var render = function(req,res){
	if(req.session.user&&app.locals.user){
		var tasks = app.locals.user.tasks;
		var _normalize = function(){
			return normalizer.clean(tasks);
		}
		var _subjects = function(){
			var tokens = _normalize();	
			return subjects.get(tokens);
		}
		/**
		 * Create the JSON data for the tasks with things like information, style, size;
		 */
		var _list = function(){
			var subjects = _subjects();
			console.log(subjects);
		}
		res.send(_subjects());
	}else{
		res.redirect('/login');
	}
}
module.exports = function(appObj){
	app = appObj
	return{
		render:render
	}
}