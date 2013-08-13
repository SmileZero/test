class Task < ActiveRecord::Base
  attr_accessible :deadline, :isdone, :remark, :remind, :title
  validates :title, :deadline, presence: true
  #before_create :deadline_validate
  before_save :remind_validate
  validates_length_of :title, :minimum => 1, :maximum=>60 
  validates_length_of :remark, :maximum=>300

  belongs_to :user

private
  def deadline_validate
    if deadline < Date.current
  		errors.add(:deadline, 'can not be set to past date!')
      return false;
  	end
    remind = ""
  end

  def remind_validate
    if remind != nil && remind.to_date > deadline
  	   errors.add(:remind, 'can not be greater than deadline!')
       return false;
     end
  end

end
