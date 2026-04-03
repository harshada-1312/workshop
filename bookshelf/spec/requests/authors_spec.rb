require 'rails_helper'

RSpec.describe 'Authors API', type: :request do
  let(:json_headers) { { 'Content-Type' => 'application/json' } }

  describe 'GET /api/authors' do
    let!(:authors) { create_list(:author, 3) }

    it 'returns a paginated list of authors' do
      get '/api/authors'
      expect(response).to have_http_status(:ok)
      expect(json_data.length).to eq(3)
    end

    it 'returns correct meta keys' do
      get '/api/authors'
      expect(json_meta).to include(:page, :per_page, :total_items, :total_pages)
      expect(json_meta[:page]).to eq(1)
      expect(json_meta[:total_items]).to eq(3)
    end

    it 'defaults to sorting by last_name asc' do
      get '/api/authors'
      last_names = json_data.map { |a| a[:last_name] }
      expect(last_names).to eq(last_names.sort)
    end

    it 'sorts by first_name' do
      get '/api/authors', params: { sort_by: 'first_name', sort_order: 'asc' }
      first_names = json_data.map { |a| a[:first_name] }
      expect(first_names).to eq(first_names.sort)
    end

    it 'sorts by created_at' do
      get '/api/authors', params: { sort_by: 'created_at', sort_order: 'desc' }
      expect(response).to have_http_status(:ok)
    end

    it 'sorts by book_count' do
      get '/api/authors', params: { sort_by: 'book_count', sort_order: 'desc' }
      expect(response).to have_http_status(:ok)
    end

    it 'sorts descending when sort_order=desc' do
      get '/api/authors', params: { sort_by: 'last_name', sort_order: 'desc' }
      last_names = json_data.map { |a| a[:last_name] }
      expect(last_names).to eq(last_names.sort.reverse)
    end

    it 'filters by search param with partial match on name' do
      known = create(:author, first_name: 'Unique', last_name: 'Testname')
      get '/api/authors', params: { search: 'Unique' }
      expect(json_data.length).to eq(1)
      expect(json_data.first[:first_name]).to eq('Unique')
    end

    it 'returns empty array when no matches' do
      get '/api/authors', params: { search: 'zzzznonexistent' }
      expect(json_data).to eq([])
    end

    it 'returns 400 for page=0' do
      get '/api/authors', params: { page: 0 }
      expect(response).to have_http_status(:bad_request)
      expect(json_error[:code]).to eq('BAD_REQUEST')
    end

    it 'returns 400 for per_page=0' do
      get '/api/authors', params: { per_page: 0 }
      expect(response).to have_http_status(:bad_request)
      expect(json_error[:code]).to eq('BAD_REQUEST')
    end

    it 'returns 400 for per_page=101' do
      get '/api/authors', params: { per_page: 101 }
      expect(response).to have_http_status(:bad_request)
      expect(json_error[:code]).to eq('BAD_REQUEST')
    end
  end

  describe 'GET /api/authors/:id' do
    let!(:author) { create(:author) }

    it 'returns the author with book_count and recent_books' do
      get "/api/authors/#{author.id}"
      expect(response).to have_http_status(:ok)
      expect(json_data[:id]).to eq(author.id)
      expect(json_data).to have_key(:book_count)
      expect(json_data).to have_key(:recent_books)
    end

    it 'returns 404 for a non-existent id' do
      get '/api/authors/999999'
      expect(response).to have_http_status(:not_found)
      expect(json_error[:code]).to eq('NOT_FOUND')
    end
  end

  describe 'POST /api/authors' do
    let(:valid_params) do
      {
        author: {
          first_name: 'Jane',
          last_name: 'Austen',
          bio: 'English novelist',
          birth_year: 1775,
          death_year: 1817,
          website: 'https://janeausten.org'
        }
      }
    end

    it 'creates an author with valid params and returns 201' do
      expect {
        post '/api/authors', params: valid_params.to_json, headers: json_headers
      }.to change(Author, :count).by(1)
      expect(response).to have_http_status(:created)
    end

    it 'returns author detail in response' do
      post '/api/authors', params: valid_params.to_json, headers: json_headers
      expect(json_data[:first_name]).to eq('Jane')
      expect(json_data[:last_name]).to eq('Austen')
    end

    it 'returns 422 for missing first_name' do
      params = { author: { last_name: 'Austen' } }
      post '/api/authors', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_error[:code]).to eq('VALIDATION_ERROR')
    end

    it 'returns 422 for missing last_name' do
      params = { author: { first_name: 'Jane' } }
      post '/api/authors', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_error[:code]).to eq('VALIDATION_ERROR')
    end

    it 'returns 422 for bio over 2000 chars' do
      params = { author: { first_name: 'Jane', last_name: 'Austen', bio: 'a' * 2001 } }
      post '/api/authors', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'returns 422 for future birth_year' do
      params = { author: { first_name: 'Jane', last_name: 'Austen', birth_year: Date.current.year + 1 } }
      post '/api/authors', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'returns 422 for death_year before birth_year' do
      params = { author: { first_name: 'Jane', last_name: 'Austen', birth_year: 1800, death_year: 1750 } }
      post '/api/authors', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'returns 400 for missing Content-Type header' do
      post '/api/authors', params: valid_params.to_json
      expect(response).to have_http_status(:bad_request)
      expect(json_error[:code]).to eq('BAD_REQUEST')
    end
  end

  describe 'PUT /api/authors/:id' do
    let!(:author) { create(:author) }

    it 'updates author with valid params' do
      params = { author: { first_name: 'Updated', last_name: 'Name' } }
      put "/api/authors/#{author.id}", params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:ok)
      expect(json_data[:first_name]).to eq('Updated')
      expect(json_data[:last_name]).to eq('Name')
    end

    it 'allows partial update (only last_name)' do
      original_first = author.first_name
      params = { author: { last_name: 'NewLast' } }
      put "/api/authors/#{author.id}", params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:ok)
      expect(json_data[:last_name]).to eq('NewLast')
      expect(json_data[:first_name]).to eq(original_first)
    end

    it 'returns 404 for non-existent id' do
      params = { author: { first_name: 'Ghost' } }
      put '/api/authors/999999', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:not_found)
    end

    it 'returns 422 for invalid data' do
      params = { author: { first_name: '' } }
      put "/api/authors/#{author.id}", params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'DELETE /api/authors/:id' do
    let!(:author) { create(:author) }

    it 'deletes the author and returns 204' do
      expect {
        delete "/api/authors/#{author.id}"
      }.to change(Author, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it 'returns 404 for non-existent id' do
      delete '/api/authors/999999'
      expect(response).to have_http_status(:not_found)
    end

    it 'returns 409 DEPENDENCY_EXISTS when author has books' do
      author_with_books = create(:author)
      create(:book, author: author_with_books, genre: 'Fiction')
      delete "/api/authors/#{author_with_books.id}"
      expect(response).to have_http_status(:conflict)
      expect(json_error[:code]).to eq('DEPENDENCY_EXISTS')
    end
  end

  describe 'GET /api/authors/:id/books' do
    it 'returns 404 when author does not exist' do
      get '/api/authors/999999/books'
      expect(response).to have_http_status(:not_found)
    end

    it 'returns empty array when author has no books' do
      author = create(:author)
      get "/api/authors/#{author.id}/books"
      expect(response).to have_http_status(:ok)
      expect(json_data).to eq([])
    end
  end
end
