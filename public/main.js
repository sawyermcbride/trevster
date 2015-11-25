/*
 *
 * Sawyer McBride 2015
 * trevster.com
 *
 */


 "use strict";


$(window).load(function(){
  App.init();
});
var App = {

	init:function(){		
		this.setDom();
		this.todo.init(this);
		this.wigets.init(this);
		this.updateMenu();	
 	},
	
	
	setDom:function(){
		this.$numberTodo = $('#number-todo');
		this.$profile = $('.username, .user-icon');
		this.$signOut = $('#sign-out');
		this.$body = $('body')
		this.$search = $('#search-btn');
		this.$query = $('#search-query');
		this.$results = $('.search-results');
	  	this.$searchContainer = $('.search-container');
	  	this.$popop = $('.popup');
	  	this.bindEvents();
	},
	
	bindEvents:function(){
	  	var self = this;

	  	this.$search.on('click',function(){
		  self.showElems([self.$searchContainer]);
		  self.$query.focus();
		});
		this.$profile.on('click',function(){
		  self.showElems([$('.profile-dropdown')])
		});
	  	this.$results.on('click','h6.search-result',this.restoreTask.bind(this));
		this.$signOut.on('click',this.signOut.bind(this));
		this.$query.on('keyup',this.query.bind(this));
		this.$body.on('click',function(){
		  self.hideElems([$('.profile-dropdown'),self.$searchContainer,self.$popop]);
		});
	  	/**
		  Elements to stop event bubble to body that initiates hiding
		  Clicking on the elements that are stopped from bubbling to the body, will NOT hide the elements that appear temproarly, such
		  as the search dropdown results or the popup box that appears 
		  Clicking on an element that bubblues to the body (any element other then specified in the below function), will be treated as a 
		  "click off" and will hide elements showing.
		*/
	  	this.$searchContainer.add(this.$profile).add(this.$popop).on('click',this.stopBubble);
	}, 
     /**
	 * Makes elements visibile
  	 * @param {Array} arr
	 */
  	showElems:function(arr){
		for(var i = 0;i<arr.length;i++){
		  arr[i].css('visibility','visible');
		}
	  event.stopPropagation();
	},
   	 /**
	 * Stops event bubbling
	 */  
  	stopBubble:function(e){
	  e.stopPropagation();
	},
  
	/**
	 * Hides elements if currently visible
	 * @param {Array} arr Dom elements to set ad hidden
	 */
	hideElems:function(arr){
	  for(var i = 0;i<arr.length;i++){
		if(arr[i].css('visibility')=='visible'){
			arr[i].css('visibility','hidden');
		}
	  }
	},
  	  /**
	  * Handles restoring, finding and returning information about a task searched for 
	  */  
  	restoreTask:function(e){
	  //use e.target because 'this' refers to parent module
	  var type = $(e.target).data('type');
	  var taskContent = $(e.target).html();
	  /**
	   * @private
	   * Find a task in the current tasks by searching the 'data-taskName' attributes of the dom elements
	   * @param {String} str Text to find in tasks, se
	   */
	  var _findTask = function(str){
		var tasks = $('ul.tasks>li');
		tasks.each(function(i){
		  var self = this;
		  if($(this).attr('data-taskname')==str){
		  	$(this).css('background','#ecf0f1');
			setTimeout(function(){
			  $(self).css('background','#abb0b3');
			},900)
		  }
	  	});
	  }
	  /**	   
	  * @private	   
	  * Gives the user more information and options about the deleted task clicked on 	   
	  */
	  var _showDeleted = function(){
		this.$popop.css('visibility','visible');
	  }
	  
	  switch(type){
		case 'complete':
		  alert('complete task');
		  break;
		case 'current':
		  _findTask(taskContent);
		  break;
		case 'deleted':
		  _showDeleted.call(this);
	  }
	  
	},
	query:function(){
		var self = this;
		$.ajax({
			type:'GET',
			url:'/search',
			dataType:'json',
			data:{
				term:this.$query.val()
			},
			success:function(data){

			  self.$results.html('');
			  var obj = JSON.parse(data);
			  if(!(obj.completed.length + obj.deleted.length + obj.current.length == 0)){

				for(var i = 0;i<obj.current.length;i++){
				  self.$results.append('<h6 class="search-result" data-type="current">'+obj.current[i]+'</h6>');
				}				
				for(var i = 0;i<obj.completed.length;i++){
				  self.$results.append('<h6 class="search-result completed-result" data-type="complete">'+obj.completed[i]+'</h6>');
				}				
				for(var i = 0;i<obj.deleted.length;i++){
				  self.$results.append('<h6 class="search-result deleted-result" data-type="deleted">'+obj.deleted[i]+'</h6>');
				}
			  }else{
				self.$results.html('<h6 style="padding:8px 0px;">No results found.</h6>')
			  }
			  if(!self.$query.val().replace(/^\s+/g,'').length) {
				self.$results.html('<h6 style="padding:8px 0px;">Type to search current/previous tasks</h6>')
			  }

			},
			error:function(){
				alert('Search could not connect');
			}
		})
	},
  
  	/**
	  * Redirects to signout page 
	  */
  	signOut:function(){
		window.location = '/signout';
	},
	updateMenu:function(){
		//set menu: date and task number
		var length = $('.tasks li').length;
		//Set hidden and shown number to do (dependant on device size)
		if(length==0){ this.$numberTodo.html('Nothing To do!');$('.mobileTodoNumber').html('Nothing To Do!');}
		else if(length==1){ this.$numberTodo.html('1 Thing to do');$('.mobileTodoNumber').html(' 1 Thing To Do!');}
		else if(length>1){ this.$numberTodo.html(length+' Things to do');$('.mobileTodoNumber').html(length+' Things to do');}
		this.$numberTodo.stop(true,true).fadeOut(90).fadeIn(90);
	},
	//todo list sub module
	todo:{
		taskIndex:0,
		init:function(appCtx){
			this.setDom();
			this.appSelf = appCtx;
		},
		
		
	 setDom:function(){
			this.$doneBtn = $('.done-box');
			this.$deleteBtn = $('.delete-icon');
			this.document = $(document);
			this.$tasks = $('.tasks');
			this.$taskName = $('.add-task-name');
			this.$addBtn = $('.add-task-icon');
			this.$addContainer = $('.add-task-container');
			this.bindEvents();	
		 //set initial value of index
		 this.taskIndex = this.$tasks.children().length;
	 },
	 //bind user actions 
	 bindEvents:function(){
			var self = this;

			this.$tasks.on('click','.done-box',this.doneTask.bind(this));
			//so element isn't binded multiple times when we re-bind
			this.$addBtn.on('click',this.addTask.bind(this));

			this.document.off('keypress').on('keypress',function(e){
				handleKeypress.call(self,e);
			});

			this.$tasks.on('click','.delete-icon',this.deleteTask.bind(this))

			function handleKeypress(e){
				if(this.$taskName.is(':focus')&&e.keyCode==13){
					this.addTask();
				}
			}
	   this.setOverflow();
	 },
	 /**
	   * Trims task name if length overflow occurs
	   */
	setOverflow:function(){
	  $('.task-name').each(function(i){
		while($(this).height()>40){
		  var text = $(this).html();
		  text=text.substr(0,text.length-4);
		  $(this).html(text+'...');
		}
	  });
	},	  
	addTask:function(){
		 var self = this;
		 //Get task name
		 var task = this.$taskName.val();
		if(task.trim()=="")return false;
		 this.$taskName.val('');
		  $.ajax({
			  type:'POST',
			  url:'/addtask',
			  data: {
			 	 task:task,
			  },
				success:function(){
					console.log(this);
					self.$tasks.append(
						$(
						 '<li class="task" data-tasknumber='+(++self.taskIndex)+"data-taskname="+task+'><div class="done-box"> \
						 	<span class="fa fa-check check-icon"></span> \
						 </div> \
						 <div class="task-content"> \
						 <h3 class="task-name">'+task+'</h3> \
						 </div> \
						 <span class="fa fa-times-circle-o delete-icon"></span>'
						)
					)	
					self.appSelf.updateMenu();
					self.setOverflow();
				},
				error:function(){
					alert('Could not connect to server');
				}
		  })
	 },
	deleteTask:function(e){
		var self = this;

		//Return if the task is in the process of being removed, 

		if(this.taskIndex!=$('.tasks li').length){
			return;
		}
		$.ajax({
			type:'DELETE',
			url:'/task/delete',
			data:{
				index: (parseInt($(e.target).closest('li').attr('data-tasknumber'))-1),
			},
			success:function(){
				//delete animation magic
				$(e.target).closest('li').css('background','#d91e18');
				$(e.target).siblings('.done-box').css('background','#8e201c');
				$(e.target).siblings('.done-box').find('.check-icon').css('color','#f3332c').delay(250).queue(function(){
					$(this).closest('li').fadeOut(250,function(){
						self.taskIndex--;									
						$(this).remove();
						self.setTaskOrder();
						self.appSelf.updateMenu();
					})
				});				
			},
			error:function(){
				alert("Could not connect to server");
			}
		})
	},
	doneTask:function(e){
		var self = this;
		//Return if animation is in progress
		if(this.taskIndex!=$('.tasks li').length){
			console.warn('task index is not equal to dom ');
			console.log(this.taskIndex);
			return;
		}
		this.taskIndex--;			
		$.ajax({
			type:"DELETE",
			url:'/task/done',
			data:{
				index: (parseInt($(e.target).closest('li').attr('data-tasknumber'))-1),
			},
			success:function(){
				//done animation magic
				$(e.target).closest('li').css('background','#27ae60')
				$(e.target).closest('.done-box').css('background','#148644');
				$(e.target).closest('.check-icon').css('color','#61bf89').delay(400).queue(function(){
					$(this).closest('li').animate({
						right:'100%'
					},585,function(){;
						//call back for removing elmement and sliding up other elements after animation
						$(this).css('opacity','0');
						$(this).slideUp(400,function(){
							$(this).remove();
							//rest data attributes to correct order
							self.setTaskOrder();
							self.appSelf.updateMenu();
							self.wigets.refresh();
						});					
					});
				});				
			},
			error:function(){
				alert("Could not connect to server");
			}
		})
	},
	editTask:function(e){
		
	},
			//set element id's on a DOM re order
	setTaskOrder:function(){
			/*cycles though li elements and sets their data-tasknumber to the number of previous,
			so we can keep set the order of these elmements and correspond them to the correct index on an action*/
			$('.task').each(function(i){
				$(this).attr('data-tasknumber',$(this).prevAll('.task').length+1);
			});				
		}			
	},
		//Rendering of wigets on right and left of todo list
	 wigets:{
		init:function(){
			this.loadWigets();
			this.setDom();
			this.bindEvents();
		},
		loadWigets:function(){
			$.ajax({
				type:"GET",
				url:"wigets/get",
				success:function(data){
					console.log(data);
				}
			})
		},
		setDom:function(){
			
		},
		bindEvents:function(){
			
		},
	},
}
