module Api
  class AuthorsController < BaseController
    before_action :set_author, only: [:show, :update, :destroy, :books]

    ALLOWED_SORTS = {
      "last_name" => "authors.last_name",
      "first_name" => "authors.first_name",
      "created_at" => "authors.created_at",
      "book_count" => "book_count"
    }.freeze

    def index
      scope = Author.all
      scope = apply_filters(scope)

      if params[:sort_by] == "book_count"
        scope = scope.left_joins(:books).group(:id).select("authors.*, COUNT(books.id) AS book_count")
      end

      scope = apply_sort(scope, ALLOWED_SORTS, "last_name")
      paginated, meta = paginate(scope)

      render_success(
        paginated.map { |author| AuthorSerializer.new(author).to_h },
        meta: meta
      )
    end

    def show
      render_success(AuthorDetailSerializer.new(@author).to_h)
    end

    def create
      author = Author.new(author_params)

      if author.save
        render_success(AuthorDetailSerializer.new(author).to_h, status: :created)
      else
        render_validation_errors(author)
      end
    end

    def update
      if @author.update(author_params)
        render_success(AuthorDetailSerializer.new(@author).to_h)
      else
        render_validation_errors(@author)
      end
    end

    def destroy
      if @author.books.exists?
        book_count = @author.books.count
        raise DependencyExistsError, "Cannot delete author: #{book_count} #{"book".pluralize(book_count)} are associated with this author"
      end

      @author.destroy!
      head :no_content
    end

    def books
      scope = @author.books
      paginated, meta = paginate(scope)

      render_success(
        paginated.map { |book| BookSerializer.new(book).to_h },
        meta: meta
      )
    end

    private

    def set_author
      @author = Author.find(params[:id])
    end

    def author_params
      params.require(:author).permit(:first_name, :last_name, :bio, :birth_year, :death_year, :website)
    end

    def apply_filters(scope)
      if params[:search].present?
        search_term = "%#{params[:search]}%"
        scope = scope.where("first_name LIKE ? OR last_name LIKE ?", search_term, search_term)
      end
      scope
    end
  end
end
