require 'rails_helper'

RSpec.describe 'Books API', type: :request do
  let(:json_headers) { { 'Content-Type' => 'application/json' } }
  let!(:author) { create(:author) }

  # --- Pagination ---

  describe 'GET /api/books - Pagination' do
    let!(:books) { create_list(:book, 25, author: author, genre: 'Fiction') }

    it 'returns first page with default per_page=20' do
      get '/api/books'
      expect(response).to have_http_status(:ok)
      expect(json_data.length).to eq(20)
      expect(json_meta[:page]).to eq(1)
      expect(json_meta[:per_page]).to eq(20)
      expect(json_meta[:total_items]).to eq(25)
      expect(json_meta[:total_pages]).to eq(2)
    end

    it 'returns second page with remaining items' do
      get '/api/books', params: { page: 2 }
      expect(response).to have_http_status(:ok)
      expect(json_data.length).to eq(5)
      expect(json_meta[:page]).to eq(2)
      expect(json_meta[:total_items]).to eq(25)
    end

    it 'respects custom per_page' do
      get '/api/books', params: { per_page: 5 }
      expect(response).to have_http_status(:ok)
      expect(json_data.length).to eq(5)
      expect(json_meta[:per_page]).to eq(5)
      expect(json_meta[:total_pages]).to eq(5)
    end

    it 'returns empty data array when page is beyond total' do
      get '/api/books', params: { page: 100 }
      expect(response).to have_http_status(:ok)
      expect(json_data).to eq([])
      expect(json_meta[:total_items]).to eq(25)
    end

    it 'returns 400 for page=0' do
      get '/api/books', params: { page: 0 }
      expect(response).to have_http_status(:bad_request)
      expect(json_error[:code]).to eq('BAD_REQUEST')
    end

    it 'returns 400 for negative page' do
      get '/api/books', params: { page: -1 }
      expect(response).to have_http_status(:bad_request)
      expect(json_error[:code]).to eq('BAD_REQUEST')
    end

    it 'returns 400 for per_page=0' do
      get '/api/books', params: { per_page: 0 }
      expect(response).to have_http_status(:bad_request)
      expect(json_error[:code]).to eq('BAD_REQUEST')
    end

    it 'returns 400 for per_page over 100' do
      get '/api/books', params: { per_page: 101 }
      expect(response).to have_http_status(:bad_request)
      expect(json_error[:code]).to eq('BAD_REQUEST')
    end

    it 'accepts per_page=1 (minimum)' do
      get '/api/books', params: { per_page: 1 }
      expect(response).to have_http_status(:ok)
      expect(json_data.length).to eq(1)
      expect(json_meta[:total_pages]).to eq(25)
    end

    it 'accepts per_page=100 (maximum)' do
      get '/api/books', params: { per_page: 100 }
      expect(response).to have_http_status(:ok)
      expect(json_data.length).to eq(25)
      expect(json_meta[:total_pages]).to eq(1)
    end

    it 'returns correct meta structure' do
      get '/api/books'
      expect(json_meta).to include(:page, :per_page, :total_items, :total_pages)
    end
  end

  # --- Sorting ---

  describe 'GET /api/books - Sorting' do
    let!(:book_a) { create(:book, author: author, title: 'Alpha', genre: 'Fiction', published_year: 2020, rating: 4.0, page_count: 300) }
    let!(:book_b) { create(:book, author: author, title: 'Beta', genre: 'Fiction', published_year: 2022, rating: 2.5, page_count: 150) }
    let!(:book_c) { create(:book, author: author, title: 'Gamma', genre: 'Fiction', published_year: 2018, rating: 5.0, page_count: 500) }

    it 'defaults to sorting by date_added' do
      get '/api/books'
      expect(response).to have_http_status(:ok)
    end

    it 'sorts by title ascending' do
      get '/api/books', params: { sort_by: 'title', sort_order: 'asc' }
      titles = json_data.map { |b| b[:title] }
      expect(titles).to eq(%w[Alpha Beta Gamma])
    end

    it 'sorts by title descending' do
      get '/api/books', params: { sort_by: 'title', sort_order: 'desc' }
      titles = json_data.map { |b| b[:title] }
      expect(titles).to eq(%w[Gamma Beta Alpha])
    end

    it 'sorts by published_year' do
      get '/api/books', params: { sort_by: 'published_year', sort_order: 'asc' }
      years = json_data.map { |b| b[:published_year] }
      expect(years).to eq([2018, 2020, 2022])
    end

    it 'sorts by rating descending' do
      get '/api/books', params: { sort_by: 'rating', sort_order: 'desc' }
      ratings = json_data.map { |b| b[:rating].to_f }
      expect(ratings).to eq([5.0, 4.0, 2.5])
    end

    it 'sorts by page_count' do
      get '/api/books', params: { sort_by: 'page_count', sort_order: 'asc' }
      pages = json_data.map { |b| b[:page_count] }
      expect(pages).to eq([150, 300, 500])
    end

    it 'falls back to default sort for invalid sort_by' do
      get '/api/books', params: { sort_by: 'invalid_field' }
      expect(response).to have_http_status(:ok)
    end

    it 'falls back to asc for invalid sort_order' do
      get '/api/books', params: { sort_by: 'title', sort_order: 'invalid' }
      titles = json_data.map { |b| b[:title] }
      expect(titles).to eq(%w[Alpha Beta Gamma])
    end
  end

  # --- Filtering ---

  describe 'GET /api/books - Filtering' do
    let(:author2) { create(:author) }

    let!(:fiction_book) { create(:book, author: author, title: 'Fiction Book', genre: 'Fiction', read_status: 'read', language: 'en', rating: 4.0, published_year: 2020) }
    let!(:scifi_book) { create(:book, author: author, title: 'Sci-Fi Book', genre: 'Science Fiction', read_status: 'reading', language: 'es', rating: 2.0, published_year: 2015) }
    let!(:fantasy_book) { create(:book, author: author2, title: 'Fantasy Book', genre: 'Fantasy', read_status: 'unread', language: 'en', rating: 5.0, published_year: 2022, description: 'A magical adventure') }

    it 'filters by genre' do
      get '/api/books', params: { genre: 'Fiction' }
      expect(json_data.length).to eq(1)
      expect(json_data.first[:genre]).to eq('Fiction')
    end

    it 'filters by read_status' do
      get '/api/books', params: { read_status: 'reading' }
      expect(json_data.length).to eq(1)
      expect(json_data.first[:read_status]).to eq('reading')
    end

    it 'filters by author_id' do
      get '/api/books', params: { author_id: author2.id }
      expect(json_data.length).to eq(1)
      expect(json_data.first[:title]).to eq('Fantasy Book')
    end

    it 'filters by language' do
      get '/api/books', params: { language: 'es' }
      expect(json_data.length).to eq(1)
      expect(json_data.first[:language]).to eq('es')
    end

    it 'filters by rating_min' do
      get '/api/books', params: { rating_min: 4.0 }
      expect(json_data.length).to eq(2)
    end

    it 'filters by rating_max' do
      get '/api/books', params: { rating_max: 3.0 }
      expect(json_data.length).to eq(1)
      expect(json_data.first[:title]).to eq('Sci-Fi Book')
    end

    it 'filters by published_year_min' do
      get '/api/books', params: { published_year_min: 2020 }
      expect(json_data.length).to eq(2)
    end

    it 'filters by published_year_max' do
      get '/api/books', params: { published_year_max: 2015 }
      expect(json_data.length).to eq(1)
      expect(json_data.first[:published_year]).to eq(2015)
    end

    it 'filters by search (title)' do
      get '/api/books', params: { search: 'Sci-Fi' }
      expect(json_data.length).to eq(1)
      expect(json_data.first[:title]).to eq('Sci-Fi Book')
    end

    it 'filters by search (description)' do
      get '/api/books', params: { search: 'magical' }
      expect(json_data.length).to eq(1)
      expect(json_data.first[:title]).to eq('Fantasy Book')
    end

    it 'combines multiple filters (AND logic)' do
      get '/api/books', params: { language: 'en', rating_min: 4.5 }
      expect(json_data.length).to eq(1)
      expect(json_data.first[:title]).to eq('Fantasy Book')
    end

    it 'returns empty array when no books match filters' do
      get '/api/books', params: { genre: 'Horror' }
      expect(json_data).to eq([])
    end

    it 'pagination works with filters' do
      create_list(:book, 5, author: author, genre: 'Fiction')
      get '/api/books', params: { genre: 'Fiction', per_page: 2 }
      expect(json_data.length).to eq(2)
      expect(json_meta[:total_items]).to eq(6) # 1 original + 5 new
      expect(json_meta[:total_pages]).to eq(3)
    end
  end

  # --- CRUD ---

  describe 'GET /api/books' do
    it 'returns empty array when no books exist' do
      get '/api/books'
      expect(response).to have_http_status(:ok)
      expect(json_data).to eq([])
    end

    it 'each book includes author_name' do
      create(:book, author: author, genre: 'Fiction')
      get '/api/books'
      expect(json_data.first).to have_key(:author_name)
      expect(json_data.first[:author_name]).to eq("#{author.first_name} #{author.last_name}")
    end
  end

  describe 'GET /api/books/:id' do
    let!(:book) { create(:book, author: author, genre: 'Fiction') }

    it 'returns the book with embedded author' do
      get "/api/books/#{book.id}"
      expect(response).to have_http_status(:ok)
      expect(json_data[:id]).to eq(book.id)
      expect(json_data[:title]).to eq(book.title)
      expect(json_data[:author]).to be_a(Hash)
      expect(json_data[:author][:id]).to eq(author.id)
      expect(json_data[:author][:first_name]).to eq(author.first_name)
    end

    it 'returns 404 for non-existent id' do
      get '/api/books/999999'
      expect(response).to have_http_status(:not_found)
      expect(json_error[:code]).to eq('NOT_FOUND')
    end
  end

  describe 'POST /api/books' do
    let(:valid_params) do
      {
        book: {
          title: 'One Hundred Years of Solitude',
          isbn: '9780060883287',
          author_id: author.id,
          published_year: 1967,
          genre: 'Fiction',
          description: 'The multi-generational story of the Buendía family',
          page_count: 417,
          language: 'es',
          rating: 4.5,
          read_status: 'read'
        }
      }
    end

    it 'creates a book with valid params and returns 201' do
      expect {
        post '/api/books', params: valid_params.to_json, headers: json_headers
      }.to change(Book, :count).by(1)
      expect(response).to have_http_status(:created)
    end

    it 'returns book detail with embedded author' do
      post '/api/books', params: valid_params.to_json, headers: json_headers
      expect(json_data[:title]).to eq('One Hundred Years of Solitude')
      expect(json_data[:author]).to be_a(Hash)
    end

    it 'sets default language to en' do
      params = { book: { title: 'Test', author_id: author.id, genre: 'Fiction' } }
      post '/api/books', params: params.to_json, headers: json_headers
      expect(json_data[:language]).to eq('en')
    end

    it 'sets default read_status to unread' do
      params = { book: { title: 'Test', author_id: author.id, genre: 'Fiction' } }
      post '/api/books', params: params.to_json, headers: json_headers
      expect(json_data[:read_status]).to eq('unread')
    end

    it 'returns 422 for missing title' do
      params = { book: { author_id: author.id, genre: 'Fiction' } }
      post '/api/books', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_error[:code]).to eq('VALIDATION_ERROR')
    end

    it 'returns 422 for missing genre' do
      params = { book: { title: 'Test', author_id: author.id } }
      post '/api/books', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'returns 422 for invalid genre' do
      params = { book: { title: 'Test', author_id: author.id, genre: 'InvalidGenre' } }
      post '/api/books', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'returns 422 for non-existent author_id' do
      params = { book: { title: 'Test', author_id: 999999, genre: 'Fiction' } }
      post '/api/books', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'returns 422 for invalid ISBN' do
      params = { book: { title: 'Test', author_id: author.id, genre: 'Fiction', isbn: '1234567890123' } }
      post '/api/books', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'returns 409 for duplicate ISBN' do
      create(:book, author: author, genre: 'Fiction', isbn: '9780060883287')
      post '/api/books', params: valid_params.to_json, headers: json_headers
      expect(response).to have_http_status(:conflict)
      expect(json_error[:code]).to eq('CONFLICT')
    end

    it 'returns 422 for invalid rating (3.7)' do
      params = { book: { title: 'Test', author_id: author.id, genre: 'Fiction', rating: 3.7 } }
      post '/api/books', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'returns 422 for rating above 5' do
      params = { book: { title: 'Test', author_id: author.id, genre: 'Fiction', rating: 6 } }
      post '/api/books', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'accepts valid rating of 0' do
      params = { book: { title: 'Test', author_id: author.id, genre: 'Fiction', rating: 0 } }
      post '/api/books', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:created)
    end

    it 'accepts valid rating of 5.0' do
      params = { book: { title: 'Test', author_id: author.id, genre: 'Fiction', rating: 5.0 } }
      post '/api/books', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:created)
    end

    it 'returns 400 for missing Content-Type header' do
      post '/api/books', params: valid_params.to_json
      expect(response).to have_http_status(:bad_request)
    end
  end

  describe 'PUT /api/books/:id' do
    let!(:book) { create(:book, author: author, genre: 'Fiction', title: 'Original Title') }

    it 'updates book with valid params' do
      params = { book: { title: 'Updated Title' } }
      put "/api/books/#{book.id}", params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:ok)
      expect(json_data[:title]).to eq('Updated Title')
    end

    it 'supports partial updates' do
      original_genre = book.genre
      params = { book: { title: 'New Title' } }
      put "/api/books/#{book.id}", params: params.to_json, headers: json_headers
      expect(json_data[:title]).to eq('New Title')
      expect(json_data[:genre]).to eq(original_genre)
    end

    it 'returns 404 for non-existent id' do
      params = { book: { title: 'Ghost' } }
      put '/api/books/999999', params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:not_found)
    end

    it 'returns 422 for invalid data' do
      params = { book: { title: '' } }
      put "/api/books/#{book.id}", params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'returns 409 for duplicate ISBN on update' do
      create(:book, author: author, genre: 'Fiction', isbn: '9780060883287')
      params = { book: { isbn: '9780060883287' } }
      put "/api/books/#{book.id}", params: params.to_json, headers: json_headers
      expect(response).to have_http_status(:conflict)
      expect(json_error[:code]).to eq('CONFLICT')
    end
  end

  describe 'DELETE /api/books/:id' do
    let!(:book) { create(:book, author: author, genre: 'Fiction') }

    it 'deletes the book and returns 204' do
      expect {
        delete "/api/books/#{book.id}"
      }.to change(Book, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it 'returns 404 for non-existent id' do
      delete '/api/books/999999'
      expect(response).to have_http_status(:not_found)
    end
  end

  # --- Author books endpoint pagination ---

  describe 'GET /api/authors/:id/books - Pagination' do
    let!(:books) { create_list(:book, 25, author: author, genre: 'Fiction') }

    it 'paginates books for an author' do
      get "/api/authors/#{author.id}/books"
      expect(response).to have_http_status(:ok)
      expect(json_data.length).to eq(20)
      expect(json_meta[:total_items]).to eq(25)
      expect(json_meta[:total_pages]).to eq(2)
    end

    it 'returns second page of author books' do
      get "/api/authors/#{author.id}/books", params: { page: 2 }
      expect(json_data.length).to eq(5)
    end

    it 'respects custom per_page for author books' do
      get "/api/authors/#{author.id}/books", params: { per_page: 10 }
      expect(json_data.length).to eq(10)
      expect(json_meta[:total_pages]).to eq(3)
    end
  end
end
