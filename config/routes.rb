Rails.application.routes.draw do
  scope ActiveStorage.routes_prefix do
    get "/blobs/info/:signed_id" => "bard/file_field/blobs#show", as: :rails_service_blob_info
  end
end

