class TasksController < ApplicationController

  # GET /tasks
  # GET /tasks.json
  def index
    if params.has_key? (:date)
      @tasks = current_user.tasks.where("deadline >= ?", params[:date]).order("isdone").order("deadline")
    else
      @tasks = current_user.tasks.order("isdone").order("deadline") #.where("deadline >= ?", Date.current)
    end
      render :json => @tasks
    #respond_to do |format|
    #  format.html # index.html.erb
    #  format.json { render json: @tasks }
    #end
  end

  # GET /tasks/1
  # GET /tasks/1.json
  def show
    @task = current_user.tasks.find_by_id(params[:id])

    if @task

      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @task }
      end
    else
      error "You don't have access to this task"
    end
  end

  # GET /tasks/new
  # GET /tasks/new.json
  def new
    @task = Task.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @task }
    end
  end

  # GET /tasks/1/edit
  def edit
    @task = current_user.tasks.find(params[:id])
  end

  # POST /tasks
  # POST /tasks.json
  def create
    @task = current_user.tasks.new(params[:task])

    respond_to do |format|
      if @task.save
        format.html { redirect_to tasks_url, notice: 'Task was successfully created.' }
        format.json { render json: @task, status: :created, location: @task }
      else
        format.html { render action: "new" }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /tasks/1
  # PUT /tasks/1.json
  def update
    @task = current_user.tasks.find(params[:id])

    if @task
      respond_to do |format|
        taskValue = params[:task]
        if Date.parse(taskValue["deadline"])  != @task.deadline && Date.parse(taskValue["deadline"]) < Date.current
          error "Deadline can't be updated to the new date!"
        elsif taskValue["remind"] != nil && taskValue["remind"] !=""  && DateTime.parse(taskValue["remind"]) != @task.remind&& DateTime.parse(taskValue["remind"]) < DateTime.now
          error "Remind can't be updated to the new time!"
        elsif @task.update_attributes(taskValue)
          format.html { render :json => @task }
        else
          error "Failed to update record"
        end
      end
    else
      error "You don't have access to this task"
    end
  end

  # DELETE /tasks/1
  # DELETE /tasks/1.json
  def destroy
    @task = current_user.tasks.find(params[:id])

    if @task
      @task.destroy

      respond_to do |format|
        format.html { redirect_to tasks_url }
        format.json { head :no_content }
      end
    else
      error "You don't have access to this task"
    end
  end

end
