$(function(){
    var validate = {
    username: function(username){
      var testEmail = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/;
      return testEmail.test(username.trim());
    },
    password: function (pwd){
      //var testPWD = /^(?![a-z]+$)(?!\d+$)[a-z0-9]{8,20}$/i;
      return (pwd != "");
    },
    password_confirmation: function (pwd){
      return ( $("#user_password").val() == "" || $("#user_password").val() == pwd );
    }
  };
  
  function validateAll(){
    var invalid = null;
    ["username", "password","password_confirmation"].forEach(function(name) {
      if(!validate[name]($("#user_"+name).val())) {
          if(!invalid) invalid=name;
          $("#user_"+name).css("border-bottom","1px solid #f03737");
      }
      else
          $("#user_"+name).css("border-bottom","1px solid #51f037");
      $("#user_"+name).data("edited",true);
    })
    if(invalid){
        $("#user_"+invalid).focus();
        return false;
    }
  }
  
  $("input").change(function(){
    $(this).data("edited",true);
  }).focus(function() {
    $(this).css("border-bottom","1px solid #51f037");
    $(this).next().empty();
  }).blur(function(){
    var $t = $(this),
         edited = $t.data("edited"),
         name = $t.attr("id").slice(5),
         value = $t.val();
  
    if(edited && !validate[name](value)) {
      $(this).css("border-bottom","1px solid #f03737");
    }
    else if(!edited){
      $(this).css("border-bottom","1px solid rgb(204, 204, 204)");
    }
  });
  
  $("form").submit(validateAll);
  
});