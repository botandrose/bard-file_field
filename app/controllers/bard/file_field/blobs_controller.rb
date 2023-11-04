module Bard
  module FileField
    class BlobsController < ActionController::Base
      @blob = ActiveStorage::Blob.find_signed!(params[:signed_id])
      render json: @blob
    end
  end
end

