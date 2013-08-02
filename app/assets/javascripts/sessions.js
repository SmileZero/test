$(function(){
	$("input").change(function(){
    		$(this).data("edited",true);
	  }).focus(function() {
	    $(this).css("border-bottom","1px solid #51f037");
	    //$(this).next().empty();
	  }).blur(function(){
	    edited = $(this).data("edited")
	  
	    
	    $(this).css("border-bottom","1px solid rgb(204, 204, 204)");
	  });

});