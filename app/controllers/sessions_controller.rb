class SessionsController < ApplicationController
  skip_filter :signed_in_user, :only => [:create] 

  def new
    #if signed_in?
      #redirect_to "/"
    #end 
  end

  def create
  	user = User.find_by_username(params[:username])
  	if user and user.authenticate(params[:password])
  		sign_in user
  		redirect_back_or root_url
  	else
  		redirect_to login_url, notice:"Invalid email/password combination"
  	end
  end

  def destroy
  	sign_out
    redirect_to root_url
  end
end
