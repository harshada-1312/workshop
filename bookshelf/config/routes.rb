Rails.application.routes.draw do
  namespace :api do
    resources :authors, only: [:index, :show, :create, :update, :destroy] do
      get :books, on: :member
    end

    resources :books, only: [:index, :show, :create, :update, :destroy]
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
