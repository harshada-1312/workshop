class Author < ApplicationRecord
  include Sanitizable

  has_many :books, dependent: :restrict_with_error

  validates :first_name, presence: true, length: { maximum: 100 }
  validates :last_name, presence: true, length: { maximum: 100 }
  validates :bio, length: { maximum: 2000 }, allow_nil: true
  validates :birth_year, numericality: { only_integer: true, less_than_or_equal_to: -> (_) { Date.current.year } }, allow_nil: true
  validates :death_year, numericality: { only_integer: true }, allow_nil: true
  validates :website, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]), message: "must be a valid URL" }, allow_blank: true
  validate :death_year_after_birth_year

  private

  def death_year_after_birth_year
    return unless birth_year.present? && death_year.present?
    errors.add(:death_year, "must be greater than or equal to birth year") if death_year < birth_year
  end
end
