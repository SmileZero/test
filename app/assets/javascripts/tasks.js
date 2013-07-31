$(function() {
	$(document).click(function() {
		$('.new-form').hide();
		$(".show-form").show();
	})
	$('.new-form').click(function(event) {
		event.stopPropagation();
	})
	$(".isdone").each(function(){
			 if ($(this)[0].checked) $(this).parent().next().addClass("line").next().addClass("line")
	})
	$(".isdone").click(function(){
		if($(this)[0].checked){
			$(this).parent().next().addClass("line").next().addClass("line")
		}
		else
			$(this).parent().next().removeClass("line").next().removeClass("line")
	})
	$(".show-form").click(function(event){
		event.stopPropagation();
		$(".new-form").show();
		$(this).hide();
	})

})