class TasksController < ApplicationController

  # GET /tasks
  # GET /tasks.json
  def index
    if params.has_key? (:date)
      @tasks = current_user.tasks.where("deadline >= ?", params[:date]).order("isdone").order("deadline").order("updated_at")
    else
      @tasks = current_user.tasks.where("deadline >= ?", Date.current).order("isdone").order("deadline").order("updated_at")
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
      ajax_error "You don't have access to this task"
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
        #format.html { redirect_to home_url, notice: 'Task was successfully created.' }
        format.json { render json: @task, status: :created, location: @task }
      else
        #format.html { render action: "new" }
        ajax_error = @task.errors.full_messages.join("\n")
        format.json {render :json => { :error => true, :message => ajax_error },status: :unprocessable_entity}
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
        deadline = Date.parse(taskValue["deadline"])
        ori_remind = @task.remind
        remind = (taskValue["remind"]==nil || taskValue["remind"]=="")? "": DateTime.parse(taskValue["remind"])
        if deadline != @task.deadline && deadline < Date.current
          ajax_error = "Deadline is invalid!"
          format.json {render :json => { :error => true, :message => ajax_error },status: :unprocessable_entity}
        elsif remind !=""  && remind != @task.remind && remind < DateTime.now
          ajax_error = "Remind is invalid!"
          format.json {render :json => { :error => true, :message => ajax_error },status: :unprocessable_entity}
        elsif @task.update_attributes(taskValue)
          # set remind email in scheduler
            if @task.remind != ori_remind
              job = current_scheduler.find_by_tag @task.id
              if job[0]
                job[0].unschedule
              end
              if @task.remind != nil &&  @task.remind != ""
                current_scheduler.at @task.remind, :tags => @task.id do
                  mailer = TaskNotifier.reminder(@task)
                  mailer.deliver # It don't work under the development mode
                end
              end
            end

          #TaskNotifier.reminder(@task).deliver
          format.html { render :json => @task }
        else
          ajax_error = @task.errors.full_messages.join("\n")
          format.json {render :json => { :error => true, :message => ajax_error },status: :unprocessable_entity}
        end
      end
    else
      ajax_error = "You don't have access to this task"
      format.json {render :json => { :error => true, :message => ajax_error },status: :unprocessable_entity}
    end
  end

  # DELETE /tasks/1
  # DELETE /tasks/1.json
  def destroy
    @task = current_user.tasks.find(params[:id])

    if @task
      @task.destroy

      respond_to do |format|
        format.html { redirect_to home_url }
        format.json { head :no_content }
      end
    else
      ajax_error =  "You don't have access to this task"
      format.json {render :json => { :error => true, :message => ajax_error },status: :unprocessable_entity}
    end
  end

end
