(function(w){
	w.onload = function(){
		alert("ON iphone in app.js");
		App.init()
	}
	var app;
	var App = {
		init:function(){
			app = this;
			this.setDom();
			this.bindEvents();
			this.updateMenu();
		},
		setDom:function(){
			//attach properties to dom
			this.numberTodo = $('#number-todo');
			this.date = $('#date');
			this.list.init();
		},
		bindEvents:function(){
			//bind event handlers to properties for menu
		},
		updateMenu:function(){
			//set menu: date and task number
			if(this.list.tasks.length==0) this.numberTodo.html('Nothing To do!');
			else if(this.list.tasks.length==1) this.numberTodo.html(this.list.tasks.length+' Thing to do');
			else if(this.list.tasks.length>1) this.numberTodo.html(this.list.tasks.length+' Things to do');
			this.numberTodo.stop(true,true).fadeOut(90).fadeIn(90);
		},
		search:function(){
			//ajax search
			//dropdown menu display results
		},
		account:function(){
			//drop down menu of account options
		},
		signOut:function(){
			//sign out ??
		},
		//Todo list sub object
		list:{
			tasks:[],
			completedTasks:[],
			deletedTasks:[],
			init:function(){
				//init for the DOM within task list
				this.$doneBtn = $('.done-box');
				this.$deleteBtn = $('.delete-icon');
				this.document = $(document);
				this.$tasks = $('.tasks');
				this.$taskName = $('.add-task-name');
				this.$addBtn = $('.add-task-icon');
				this.$addContainer = $('.add-task-container');
				this.bindEvents();
			},
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
			},
			addTask:function(){
				var newTask = new Task(this.$taskName.val());
				this.tasks.push(newTask);
				//Update task on server
			$.ajax({
				type:'POST',
				url:'/addtask',
				data: {
					task:this.$taskName.val(),
					user: $('.username').html()
				},
				success:function(data){
					console.log("updated with "+task);
				}
			})
				
				renderNewTask.call(this);
				//append new task from information in search bar and clear search bar
				function Task(taskName){
					this.taskName = taskName;
				}
					function renderNewTask(){
						var d = new Date();
					//smoothly render a change to the object
						//TODO: USE A TEMPLATE ENGINE!!!
						console.log(this.tasks);
					this.$tasks.append(
						$(
							'<li class="task" data-tasknumber='+this.tasks.length+'><div class="done-box"> \
							<span class="fa fa-check check-icon"></span> \
						</div> \
						<div class="task-content"> \
							<h3 class="task-name">'+this.tasks[this.tasks.length-1].taskName+'</h3> \
						</div> \
						<span class="fa fa-times-circle-o delete-icon"></span>'
						)
					)
				}
				//TODO
				//check if their is an overflow to lower font-size
				console.log(this.$tasks.last().find('.task-content').width());
				
				//re bind to new events
			//	this.init();
				app.updateMenu();
			},
			deleteTask:function(e){
				//delete task selected
				
				if(this.tasks.length!=$('.task').length)return;
				
				$.ajax({
					type:'POST',
					url:'/deletetask',
					data:{
						index: (parseInt($(e.target).closest('li').attr('data-tasknumber'))-1),
						user: $('.username').html()	
					}
				})
				//add element to complete tasks
				this.deletedTasks.push(this.tasks[parseInt($(e.target).closest('li').attr('data-tasknumber'))-1]);
				//remove arr element of corresponsing dom element
				this.tasks.splice(parseInt($(e.target).closest('li').attr('data-tasknumber'))-1,1);
				console.log(this.tasks);
				//delete animation magic
				$(e.target).closest('li').css('background','#d91e18');
				$(e.target).siblings('.done-box').css('background','#8e201c');
				$(e.target).siblings('.done-box').find('.check-icon').css('color','#f3332c').delay(400).queue(function(){
					$(this).closest('li').fadeOut(300,function(){
						$(this).remove();
					})
				});
				
				
			//	$(e.target).closest('li').remove();
						//rest data attributes to correct order
					taskSetOrder();
					console.log(this.completedTasks);															
				function taskSetOrder(){
					/*cycles though li elements and sets their data-tasknumber to the number of previous,
					so we can keep set the order of these elmements and correspond them to the correct index on an action*/
					$('.task').each(function(i){
						$(this).attr('data-tasknumber',$(this).prevAll('.task').length+1);
					});
				}
				app.updateMenu();				;
			},
			doneTask:function(e){
				//if removal is in progress
				if(this.tasks.length!=$('.task').length)return;
				//add element to complete tasks
				this.completedTasks.push(this.tasks[parseInt($(e.target).closest('li').attr('data-tasknumber'))-1]);
				//remove arr element of corresponsing dom element
				this.tasks.splice(parseInt($(e.target).closest('li').attr('data-tasknumber'))-1,1);
				console.log(this.tasks);
				//done animation magic
				$(e.target).closest('li').css('background','#27ae60')
				$(e.target).closest('.done-box').css('background','#148644')
				$(e.target).closest('.check-icon').css('color','#61bf89').delay(400).queue(function(){
					$(e.target).closest('li').animate({
						right:'100%'
					},800,function(){
						//call back for removing elmement and sliding up other elements after animation
						$(this).css('opacity','0');
						$(this).slideUp(800,function(){
							$(this).remove();
							//rest data attributes to correct order
							taskSetOrder();
						});					
					});
				});

					console.log(this.completedTasks);															
				function taskSetOrder(){
					/*cycles though li elements and sets their data-tasknumber to the number of previous,
					so we can keep set the order of these elmements and correspond them to the list.tasks array*/
					$('.task').each(function(i){
						$(this).attr('data-tasknumber',$(this).prevAll('.task').length+1);
					});
				}
				app.updateMenu();
			},

		},
	}
})(window);
