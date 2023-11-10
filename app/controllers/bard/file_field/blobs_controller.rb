module Bard
  module FileField
    class BlobsController < ActionController::Base
      def show
        @blob = ActiveStorage::Blob.find_signed!(params[:signed_id])
        render json: @blob
      end
    end
  end
end

