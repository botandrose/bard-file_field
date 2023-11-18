class Post < ActiveRecord::Base
  has_one_attached :file
  has_one_attached :image
  has_many_attached :images
end

