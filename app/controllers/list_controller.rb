class ListController < ApplicationController
  def index
  	#@tasks = current_user.tasks.where("deadline >= ?", Date.current).order("isdone").order("deadline")
  	
  end
end
