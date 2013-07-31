class Task < ActiveRecord::Base
  attr_accessible :deadline, :isdone, :remark, :remind, :title
  validates :title, :deadline, presence: true
  #before_save :deadline_validate
  before_save :remind_validate

  belongs_to :user

  private
  def deadline_validate
  	#if deadline == nil 
  	#	errors.add(:deadline, 'has invalidate date!')
    #  return false;
  	#elsif deadline < Date.current
    if deadline != nil && deadline < Date.current
  		errors.add(:deadline, 'has invalidate date!')
      return false;
  	end
  end

  def remind_validate
    if remind != nil && remind.to_date > deadline
  	   errors.add(:remind, 'has invalidate time!')
       return false;
     end
  end

end
