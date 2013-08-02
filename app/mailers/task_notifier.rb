class TaskNotifier < ActionMailer::Base
  default from: 'iTask <iTask@example.com>'

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.task_notifier.reminder.subject
  #
  def reminder(task)
    @task = task

    mail to: @task.user.username, subject: 'iTask remind you of a task!'
   
  end
end
