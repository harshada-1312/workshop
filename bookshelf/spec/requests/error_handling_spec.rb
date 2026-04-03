require 'rails_helper'

RSpec.describe 'Error Handling', type: :request do
  describe 'malformed JSON body' do
    it 'returns 400 BAD_REQUEST for invalid JSON' do
      post '/api/authors',
           params: '{ invalid json ',
           headers: { 'Content-Type' => 'application/json' }
      expect(response).to have_http_status(:bad_request)
      expect(json_error[:code]).to eq('BAD_REQUEST')
      expect(json_error[:message]).to include('Invalid JSON')
    end
  end

  describe 'missing Content-Type' do
    it 'returns 400 BAD_REQUEST when Content-Type is not application/json' do
      post '/api/authors', params: { author: { first_name: 'Test' } }.to_json
      expect(response).to have_http_status(:bad_request)
      expect(json_error[:code]).to eq('BAD_REQUEST')
      expect(json_error[:message]).to include('Content-Type')
    end
  end

  describe 'non-existent route' do
    it 'returns 404 for unknown route' do
      get '/api/nonexistent'
      expect(response).to have_http_status(:not_found)
    end
  end
end
