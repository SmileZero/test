class User < ActiveRecord::Base
  attr_accessible :password, :password_confirmation, :username
  validates :username,:password, :password_confirmation, presence: true
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :username, format: {with: VALID_EMAIL_REGEX}, uniqueness: true

  has_many :tasks, dependent: :destroy

  has_secure_password

  before_save { |user| user.username = username.downcase }
  before_save :create_remember_token

  private

    def create_remember_token
      self.remember_token = SecureRandom.urlsafe_base64
    end

end
