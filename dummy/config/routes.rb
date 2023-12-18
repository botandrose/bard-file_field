Rails.application.routes.draw do
  root to: "posts#new"
  resources :posts

  resources :validations
  resources :edge_cases
end
