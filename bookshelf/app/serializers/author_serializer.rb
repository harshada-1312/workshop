class AuthorSerializer
  include Alba::Resource

  attributes :id, :first_name, :last_name, :bio, :birth_year, :death_year, :website, :created_at, :updated_at

  attribute :book_count do |author|
    author.books.count
  end
end
