class BookDetailSerializer
  include Alba::Resource

  attributes :id, :title, :isbn, :published_year, :genre,
             :description, :page_count, :language, :rating, :read_status,
             :date_added, :created_at, :updated_at

  attribute :author do |book|
    {
      id: book.author.id,
      first_name: book.author.first_name,
      last_name: book.author.last_name,
      bio: book.author.bio,
      birth_year: book.author.birth_year,
      death_year: book.author.death_year,
      website: book.author.website,
      created_at: book.author.created_at,
      updated_at: book.author.updated_at
    }
  end
end
