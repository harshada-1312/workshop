module Api
  class BooksController < BaseController
    before_action :set_book, only: [:show, :update, :destroy]

    ALLOWED_SORTS = {
      "title" => "books.title",
      "published_year" => "books.published_year",
      "date_added" => "books.date_added",
      "rating" => "books.rating",
      "page_count" => "books.page_count"
    }.freeze

    def index
      scope = Book.includes(:author)
      scope = apply_filters(scope)
      scope = apply_sort(scope, ALLOWED_SORTS, "date_added")
      paginated, meta = paginate(scope)

      render_success(
        paginated.map { |book| BookSerializer.new(book).to_h },
        meta: meta
      )
    end

    def show
      render_success(BookDetailSerializer.new(@book).to_h)
    end

    def create
      book = Book.new(book_params)

      if book.save
        render_success(BookDetailSerializer.new(book).to_h, status: :created)
      elsif isbn_conflict?(book)
        raise ConflictError, "A book with ISBN #{book.isbn} already exists"
      else
        render_validation_errors(book)
      end
    end

    def update
      if @book.update(book_params)
        render_success(BookDetailSerializer.new(@book).to_h)
      elsif isbn_conflict?(@book)
        raise ConflictError, "A book with ISBN #{@book.isbn} already exists"
      else
        render_validation_errors(@book)
      end
    end

    def destroy
      @book.destroy!
      head :no_content
    end

    private

    def set_book
      @book = Book.find(params[:id])
    end

    def book_params
      params.require(:book).permit(
        :title, :isbn, :author_id, :published_year, :genre,
        :description, :page_count, :language, :rating, :read_status
      )
    end

    def isbn_conflict?(book)
      book.errors.where(:isbn).any? { |e| e.type == :taken }
    end

    def apply_filters(scope)
      scope = scope.where(genre: params[:genre]) if params[:genre].present?
      scope = scope.where(read_status: params[:read_status]) if params[:read_status].present?
      scope = scope.where(author_id: params[:author_id]) if params[:author_id].present?
      scope = scope.where(language: params[:language]) if params[:language].present?
      scope = scope.where("rating >= ?", params[:rating_min]) if params[:rating_min].present?
      scope = scope.where("rating <= ?", params[:rating_max]) if params[:rating_max].present?
      scope = scope.where("published_year >= ?", params[:published_year_min]) if params[:published_year_min].present?
      scope = scope.where("published_year <= ?", params[:published_year_max]) if params[:published_year_max].present?
      if params[:search].present?
        term = "%#{params[:search]}%"
        scope = scope.where("title LIKE :q OR description LIKE :q", q: term)
      end
      scope
    end
  end
end
