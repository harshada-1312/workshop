class AuthorDetailSerializer
  include Alba::Resource

  attributes :id, :first_name, :last_name, :bio, :birth_year, :death_year, :website, :created_at, :updated_at

  attribute :book_count do |author|
    author.books.count
  end

  attribute :recent_books do |author|
    author.books.order(date_added: :desc).limit(5).map do |book|
      {
        id: book.id,
        title: book.title,
        genre: book.genre,
        rating: book.rating,
        read_status: book.read_status,
        date_added: book.date_added
      }
    end
  end
end
