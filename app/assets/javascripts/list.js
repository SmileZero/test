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
			$(".updating").hide();
			$(".title-content").width($(".data").width()-160);
		}
	});
	$(".update-btn").click(function(event){
		if($(".task_list").is(":hidden")==true){
			//update data
			//console.debug(oneTaskView.retrieveValues());
			$(".update-btn").hide();
			$(".updating").show();
			var temptask = oneTaskView.model
			if(!temptask.get("isdone")) {
				var value = oneTaskView.retrieveValues();
				if(value.deadline!= temptask.get("deadline") && value.deadline < new Date().Format("yyyy-MM-dd") ){
				  	alert("Deadline is invalid");
				  	return;
				}
				temptask.save(value,{wait: true,
					success: function() {
						//return the task list
						oneTaskView.hide();
						tasksView.show();
						$(".add-btn").show();
						$(".back-btn").hide();
						$(".updating").hide();
						$(".title-content").width($(".data").width()-160);
						myTasks.fetch({reset: true, success:function(){
							var maxY = $(".task_list").height() - $(".task_list > .wrapper").height();
							maxY = maxY > 0 ? 0:maxY;
							var tmptask = myTasks.findWhere({id: temptask.id});
							var index = myTasks.indexOf(tmptask);
							if(index > -1){
								var newY = -$(".data").outerHeight()*index;
								console.debug(newY+":"+maxY);
								if(newY < maxY )
									tasksView.scroller.scrollTo(0,  maxY, 0);
								else
									tasksView.scroller.scrollTo(0,  newY, 0);
								//Emphasize the new element
								$(".data").eq(index).css({'background-color':'#d3d3d3'}).animate({'background-color':'#fff'},1000);
							}
						}});
					},
					error: function(model, response) {
						alert(response.responseJSON.message);
						myTasks.fetch({reset: true, success:function(){
							$(".update-btn").show();
							$(".updating").hide();
						}});
					}
				});
			}
			else{
				alert("Task can not be updated when it is done!");
				$(".update-btn").show();
				$(".updating").hide();
			}
		}
	});
	$(".submit-btn").click(function(event){
		tasksView.addTask(tasksView.retrieveValues());
		//console.debug(tasksView.retrieveValues());
	});
	$(window).resize(function(){
		$(".task_list").height($(".left").height()-63);
		$(".title-content").width($(".data").width()-160);
	});
//======================================================================================
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, 
        "d+": this.getDate(), 
        "h+": this.getHours(),
        "m+": this.getMinutes(), 
        "s+": this.getSeconds(), 
        "q+": Math.floor((this.getMonth() + 3) / 3), 
        "S": this.getMilliseconds() 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
$.datepicker._gotoToday = function(id) {
       var target = $(id);
       var inst = this._getInst(target[0]);
       if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
           inst.selectedDay = inst.currentDay;
           inst.drawMonth = inst.selectedMonth = inst.currentMonth;
           inst.drawYear = inst.selectedYear = inst.currentYear;
       } else {
           var date = new Date();
         inst.selectedDay = date.getDate();
         inst.drawMonth = inst.selectedMonth = date.getMonth();
         inst.drawYear = inst.selectedYear = date.getFullYear();
         this._setDateDatepicker(target, date);
         this._selectDate(id, this._getDateDatepicker(target));
     }
     this._notifyChange(inst);
     this._adjustDate(target);
}
//===========================Task===================================================
	var Task = Backbone.Model.extend({
		initialize: function() {
		},
		setDone: function(done) {
			if(done){
				this.save({"isdone":true},{success:function(){
					myTasks.fetch({reset: true});
				}});
			}
			else{
				this.save({"isdone":false},{success:function(){
					myTasks.fetch({reset:true});
				}});
			}
	    },
	    urlRoot: "/tasks/",
	    validate: function(attrs, options) {
		    if (attrs.title == "" ) {
		     	return "Title can't be blank";
		    }
		    if(attrs.deadline == "") {// || attrs.deadline < new Date().Format("yyyy-MM-dd") 
		    	return "Deadline is invalid";
		    }

		    /*if(attrs.remind != null && attrs.remind > attrs.deadline ) {
		    	return "Remind is invalid";
		    }*/
		}
	});
	var TaskList = Backbone.Collection.extend({
		model: Task,
		url: '/tasks?date=' + new Date().Format("yyyy-MM-dd"),
		initialize: function() {
		}/*,
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
	    }*/
	});

	var TaskView = Backbone.View.extend({
		tagName: 'li',
		template: _.template($("#task-template").html()),
		className: "data pr",
		events: {
	      'click a.del-btn': '_delete',
	      'change .isdone': 'clickLeftBtn',
		  'dblclick .text': 'showOneTask'
	    },
		initialize: function() {
			//this.listenTo(this.model, "change", this.changeRefresh);
		},
		changeRefresh: function() {
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
	      	  this.model.setDone(done);
	      	  //this.model.collection.fetch({reset:true});
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
		  this.collection.bind('add',    this.addOne, this);
		  this.collection.bind('reset',  this.addAll, this);
		  //this.collection.bind('sort',  this.refresh, this);
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

		  if(value.deadline < new Date().Format("yyyy-MM-dd") ){
		  	alert("Deadline is invalid");
		  	return;
		  }

	      newtask.set(value).save(null,{wait:true,
	      	success: function() {
	      		//Go back to today
	      		var today = new Date().Format("yyyyMMdd");
	      		myTasks.url = '/tasks?date=' + today;
	      		myTasks.fetch({reset: true, success:function(){
					$(".add-title").val('');
					$('.new-form').hide();
					$(".show-form").show();
					$( "#datepicker" ).datepicker( "setDate", today);
					//Scroll to the new element
					var maxY = $(".task_list").height() - $(".task_list > .wrapper").height();
					maxY = maxY > 0 ? 0:maxY;
					var tmptask = myTasks.findWhere({id: newtask.id});
					var index = myTasks.indexOf(tmptask);
					if(index > -1){
						var newY = -$(".data").outerHeight()*index;
						console.debug(newY+":"+maxY);
						if(newY < maxY )
							tasksView.scroller.scrollTo(0,  maxY, 0);
						else
							tasksView.scroller.scrollTo(0,  newY, 0);
						//Emphasize the new element
						$(".data").eq(index).css({'background-color':'#d3d3d3'}).animate({'background-color':'#fff'},1000);
					}
		      	}});
	      	},
	      	error: function(model, response) {
	      		alert(response.responseJSON.message);
	      	}
	      });
	      
	    },
	    retrieveValues: function(){
	    	if($(".new-form").is(":visible")){
		    	return {
			        title: $(".add-title").val().trim(),
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
			$(".data").remove();
		    this.collection.each(this.addOne);
			this.scroller.refresh();
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
			else json.remind = new Date(remind).Format("yyyy-MM-ddThh:mm");
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
			var temprm = $(".oremind").val()==""? "":new Date($(".oremind").val().replace("T", " ")).toISOString();
	    	return {
		        title: $(".otitle").html().replace(new RegExp('&nbsp;', 'gi'),"").trim(),
		        deadline: $(".odeadline").val(),
		        remind: temprm,
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
			tasksView.scroller.refresh();
			//console.debug($(".title-content").width());
		}
	});
	$(".task_list").height($(".left").height()-63);
	var currentDate = $( "#datepicker" ).datepicker({
	  showButtonPanel: true,
	  dateFormat: "yymmdd",
	  onSelect: function(dateText) {
	    //console.debug(dateText);
	    myTasks.url = '/tasks?date=' + dateText;
	    myTasks.fetch({
	    	reset: true,
			success:function(){
				//tasksView.refresh();
				$(".title-content").width($(".data").width()-160);
				//console.debug($(".title-content").width());
			}
		});
	  }
	});

})