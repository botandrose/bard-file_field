Rails.application.routes.draw do
  root to: "posts#new"
  resources :posts

  get "/previews/:signed_id" => "previews#show"
end
