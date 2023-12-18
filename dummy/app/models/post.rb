class Post < ActiveRecord::Base
  has_one_attached :file
  has_one_attached :image
  has_many_attached :images

  validates_numericality_of :number, allow_nil: true
  attr_accessor :number
end

