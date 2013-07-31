$(function() {
	$(document).click(function() {
		$('.new-form').hide();
		$(".show-form").show();
	});
	$('.new-title').click(function(event) {
		event.stopPropagation();
	});
	$('.new-deadline').click(function(event) {
		event.stopPropagation();
	});
	$('.new-submit').click(function(event) {
		event.stopPropagation();
	});
	$(".add-btn").click(function(event){
		event.stopPropagation();
		$(".new-form").show();
		$(".show-form").hide();
	});
	$(".back-btn").click(function(event){
		if($(".task_list").is(":hidden")==true){
			oneTaskView.hide();
			tasksView.show();
			$(".add-btn").show();
			$(".back-btn").hide();
			$(".update-btn").hide();
			$(".title-content").width($(".data").width()-160);
		}
	});
	$(".update-btn").click(function(event){
		if($(".task_list").is(":hidden")==true){
			//update data
			//console.debug(oneTaskView.retrieveValues());
			oneTaskView.model.set(oneTaskView.retrieveValues()).save(null,{
				success: function() {
					//return the task list
					oneTaskView.hide();
					tasksView.show();
					$(".add-btn").show();
					$(".back-btn").hide();
					$(".update-btn").hide();
					$(".title-content").width($(".data").width()-160);
					tasksView.scroller.refresh();
				},
				error: function() {
				}
			});
			
		}
	});
	$(".submit-btn").click(function(event){
		tasksView.addTask(tasksView.retrieveValues());
		$(".add-title").val('');
		$('.new-form').hide();
		$(".show-form").show();
		//console.debug(tasksView.retrieveValues());
	});
	$(window).resize(function(){
		$(".task_list").height($(".left").height()-63);
		$(".title-content").width($(".data").width()-160);
	});
//==========================Helper==================================================
	function addFmClick(view, selector, callback) {
		view.events = view.events || {};
		var x, y;
		view.events['mousedown ' + selector] = function(e) {
		  x = e.screenX;
		  y = e.screenY;
		};
		view.events['mouseup ' + selector] = function(e) {
		  if (x == e.screenX && y == e.screenY)
		    callback.call(this, e);
		};
		view.$el.on('fmClick', selector, function(e) {
		  callback.call(view, e);
		});
	}
//===========================Task===================================================
	var Task = Backbone.Model.extend({
		initialize: function() {
		},
		setDone: function(done) {
			if(done)
			this.save({"isdone":true});
			else
			this.save({"isdone":false});
	    },
	    urlRoot: "/tasks/",
	    validate: function(attrs, options) {
		    if (attrs.title == "" ) {
		     	return "Title can't be blank";
		    }

	    	//var today = new Date();
		    //var date = new Date(today.getFullYear(),today.getMonth(), today.getDate());
		    //|| (new Date(attrs.deadline) < date)
		    if(attrs.deadline == "" ) {
		    	return "Deadline is invalid";
		    }

		    /*if(attrs.remind != null && attrs.remind > attrs.deadline ) {
		    	return "Remind is invalid";
		    }*/
		}
	});
	var TaskList = Backbone.Collection.extend({
		model: Task,
		url: '/tasks',
		initialize: function() {
		},
		comparator: function(a,b) {
	       if(a.get("isdone")>b.get("isdone"))
	       	return 1;
	       else if(a.get("isdone")<b.get("isdone"))
	       	return -1;
	       else{
	       	if(a.get("deadline")> b.get("deadline"))
	       		return 1;
	       	else if (a.get("deadline")< b.get("deadline"))
	       		return -1;
	       	else return 0;
	       }
	    }
	});

	var TaskView = Backbone.View.extend({
		tagName: 'li',
		template: _.template($("#task-template").html()),
		className: "data pr",
		events: {
	      'click a.del-btn': '_delete',
		  'dblclick .text': 'showOneTask'
	    },
		initialize: function() {
			//this.tasks = this.options.tasks;
			addFmClick(this, '.isdone',   this.clickLeftBtn);
			this.listenTo(this.model, "change", this.changeRefresh);
		},
		changeRefresh: function() {
			myTasks.sort();
		},
		render: function() {
			var json = this.model.toJSON();
			if(json.isdone) json.isdone = "checked"
			else json.isdone = ""
			this.$el.html(this.template(json));
			if(json.isdone=="checked") this.$el.find(".text").addClass("line");
			else this.$el.find(".text").removeClass("line");
			return this;
		},
		clickCheckbox: function(e) {
	      var $t      = $(e.target),
	          done = $t[0].checked  ? true  : false
	          //task_id = $t.parent().data('id'),
	          //task  = myTasks.get(task_id);
	      	  this.model.setDone(!done);
	      	  this.model.collection.sort();
	    },
	    clickLeftBtn: function(e){
	    	this.clickCheckbox(e);
	    },
	    _delete: function(e) {
	      e.preventDefault();

	      //delete model
	      var bool = confirm("Are you sure to delete this task?");
	      if(bool){
	      	this.remove();
	      	this.model.destroy();
	      	tasksView.scroller.refresh();
	      }
	    },
		showOneTask: function() {
			//console.debug(this.model.id);
			tasksView.hide();
			oneTaskView.setModel(this.model);
			oneTaskView.show();
			$(".add-btn").hide();
			$(".back-btn").show();
			$(".update-btn").show();
		}
	});
	var TasksView = Backbone.View.extend({
		el: ".task_list > .wrapper > ul",
		events: {
		},
		initialize: function() {
		  //this.collection.bind('add',    this.addOne, this);
		  this.collection.bind('reset',  this.addAll, this);
		  this.collection.bind('sort',  this.refresh, this);
	      this.scroller = new iScroll("task_list",{
	      	 hScroll : false,
	      	 fadeScrollbar: true
	      });
		},
	    addTask: function(value) {
	      var that = this;
	      var newtask = new Task();
	      newtask.on("invalid", function(model, error) {
			  alert(error);
		  });

	      newtask.set(value).save(null,{
	      	success: function() {
	      		that.collection.fetch();
	      	}
	      });
	      
	    },
	    retrieveValues: function(){
	    	if($(".new-form").is(":visible")){
		    	return {
			        title: $(".add-title").val(),
			        deadline: $(".add-deadline").val()
			    };
			}
			else return {};
	    },
		addOne: function(task) {
		  var view = new TaskView({model: task});
		  
		  $(".task_list > .wrapper > ul").append(view.render().el);
		},
		addAll: function() {
		  this.collection.each(this.addOne);
		},
		refresh: function() {
			$(".data").remove();
			this.collection.each(this.addOne);
			this.scroller.refresh();
		},
		hide: function(){
			$(".task_list").hide();
			//this.scroller.refresh();
		},
		show: function(){
			$(".task_list").show();
		}
	});

//======================================================================================
var OneTaskView = Backbone.View.extend({
		tagName: 'div',
		template: _.template($("#one-task-template").html()),
		className: "one-data",
		events: {
	    },
		initialize: function() {
		},
		setModel: function(task){
			this.model = task;
		},
		render: function() {
			var json = this.model.toJSON();
			var remind = json.remind;
			if(remind==null) remind = "";
			else json.remind = remind.substring(0,remind.length-1);
			if(json.remark==null) json.remark = "";
			this.$el.html(this.template(json));
			return this;
		},
		show: function() {
		  $(".one_task").append(this.render().el);
		},
		hide: function() {
		  $(".one_task").children().detach();
		},
		retrieveValues: function() {
	    	return {
		        title: $(".otitle").html(),
		        deadline: $(".odeadline").val(),
		        remind: $(".oremind").val(),
		        remark: $(".oremark").html()
		    };
		}
});
//======================================================================================
	window.myTasks = new TaskList(); 
	var tasksView = new TasksView({collection: myTasks});
	var oneTaskView = new OneTaskView();


	tasksView.render();

	myTasks.fetch({
		success:function(){
			$(".title-content").width($(".data").width()-160);
			//console.debug($(".title-content").width());
		}
	});
	$(".task_list").height($(".left").height()-63);
	var currentDate = $( "#datepicker" ).datepicker({
	  dateFormat: "yymmdd",
	  onSelect: function(dateText) {
	    console.debug(dateText);
	    myTasks.url = '/tasks?date=' + dateText;
	    myTasks.fetch({
	    	reset: true,
			success:function(){
				tasksView.refresh();
				$(".title-content").width($(".data").width()-160);
				//console.debug($(".title-content").width());
			}
		});
	  }
	});

})