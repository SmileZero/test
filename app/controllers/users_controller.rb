class UsersController < ApplicationController
  skip_before_filter :signed_in_user
  # GET /users
  # GET /users.json
  def index
    @users = User.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @users }
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    if params[:id].to_i == current_user.id
      #@user = User.find(params[:id])

      render :json => current_user
      #respond_to do |format|
      #  format.html # show.html.erb
      #  format.json { render json: @user }
      #end
    else
      error "Access denied"
    end
  end

  # GET /users/new
  # GET /users/new.json
  def new
    @user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/1/edit
  def edit
    if params[:id].to_i == current_user.id
        current_user
    end
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(params[:user])

    if @user.save
      sign_in @user
      redirect_to home_url
    else
      flash[:un_val] = @user.username

      flash[:un_error] = !!@user.errors.messages[:username]
      flash[:pwd_error] = !!@user.errors.messages[:password]
      redirect_to "/signup"
    end

    #respond_to do |format|
    #  if @user.save
    #    format.html { redirect_to @user, notice: 'User was successfully created.' }
    #    format.json { render json: @user, status: :created, location: @user }
    #  else
    #    format.html { render action: "new" }
    #    format.json { render json: @user.errors, status: :unprocessable_entity }
    #  end
    #end
  end

  # PUT /users/1
  # PUT /users/1.json
  def update
    if params[:id].to_i == current_user.id

      if current_user.update_attributes(params[:user])
        render :json => current_user
      else
        error 'Failed to update'
      end
      #@user = User.find(params[:id])

      #respond_to do |format|
      #  if @user.update_attributes(params[:user])
      #    format.html { redirect_to @user, notice: 'User was successfully updated.' }
      #    format.json { head :no_content }
      #  else
      #    format.html { render action: "edit" }
      #    format.json { render json: @user.errors, status: :unprocessable_entity }
      #  end
    else
      error 'Failed to update'
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    #@user = User.find(params[:id])
    #@user.destroy

    #respond_to do |format|
    #  format.html { redirect_to users_url }
    #  format.json { head :no_content }
    #end
  end

  private

    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_path) unless current_user?(@user)
    end

end
