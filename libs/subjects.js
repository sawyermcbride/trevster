var fs = require('fs');
/**
 * Function to process the tasks and extract subjects from them using a text file to match words to subjects
 * @param   {Array} words The words extracted from the tasks 
 * @returns {Array} the extracted subjects that can be used to render wigets
 */

var subjects = function(words){
var a = [];
	var itemsStr = "";
	for(var i = 0;i<sets.lists.length;i++){
		sets.lists[i].items.forEach(function(elem,index,arr){
			if(words.indexOf(elem.toLowerCase())!=-1){
			itemsStr+=sets.lists[i].keywords.toString();
			}
		});
	}
	a = itemsStr.split(',');
	//Remove dublicate subjects by looking if the position of first occurence of elem if the same as the current elem and remove blanks
	var results  = a.filter(function(elem,index){
		return a.indexOf(elem)==index && elem!="";
	});
	return results;
}
/**
 * Creates the sets by reading the text file and exposes access to the arrays of words
 * @returns {Object} public function for access to the word sets
 */

 var sets = (function(){
	//NLP cateogry sets
	var wordLists = [];
	//String to hold text
	var txt = '';

	var data = fs.readFileSync('C:/Users/sawyermcbride/Desktop/Trevster/libs/text/subjects.txt','utf8')
	if(data==''){
		console.log('File could not be read. Check if it was moved or deleted.')
		return false;
	}
	txt=data.split('-----');
	for(var i = 0;i<txt.length;i++){
		var keywords = txt[i].match(/[^\nkeywords:].+/)[0];
		var items = txt[i].split('=')[1].split('\r\n');
		wordLists.push(set(keywords,items));
	}
	 //Creator function to make list object
	function set(keywords,items){
		return{
			keywords:keywords.split(','),
			items:items
		}
	}
	return{
		lists:wordLists
	}
}());
module.exports.get = subjects;