class ApplicationController < ActionController::Base
  before_filter :signed_in_user
  
  protect_from_forgery
  include SessionsHelper

  protected
  	def error(message)
    	flash[:error] = message
    	render :json => {}
    	#redirect_to root_path
  	end
end
