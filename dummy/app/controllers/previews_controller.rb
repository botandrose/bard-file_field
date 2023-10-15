class PreviewsController < ApplicationController
  def show
    @blob = ActiveStorage::Blob.find_signed!(params[:signed_id])
    render json: @blob
  end
end

