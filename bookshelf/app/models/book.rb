class Book < ApplicationRecord
  include Sanitizable

  belongs_to :author

  ALLOWED_GENRES = [
    "Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery",
    "Thriller", "Romance", "Horror", "Biography", "History",
    "Science", "Philosophy", "Self-Help", "Business", "Technology",
    "Poetry", "Children", "Young Adult", "Graphic Novel", "Other"
  ].freeze

  ALLOWED_READ_STATUSES = %w[unread reading read].freeze

  validates :title, presence: true, length: { maximum: 300 }
  validates :isbn, isbn: true, uniqueness: { allow_nil: true }, allow_nil: true
  validates :genre, presence: true, inclusion: { in: ALLOWED_GENRES }
  validates :description, length: { maximum: 5000 }, allow_nil: true
  validates :page_count, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
  validates :language, length: { maximum: 2 }, allow_nil: true
  validates :rating, rating: true
  validates :read_status, inclusion: { in: ALLOWED_READ_STATUSES }
  validates :published_year, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 1000,
    less_than_or_equal_to: ->(_) { Date.current.year }
  }, allow_nil: true

  before_create :set_date_added

  private

  def set_date_added
    self.date_added ||= Time.current
  end
end
