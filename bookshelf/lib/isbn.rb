module Isbn
  def self.valid?(isbn_string)
    return false unless isbn_string.match?(/\A\d{13}\z/)
    digits = isbn_string.chars.map(&:to_i)
    sum = digits.each_with_index.sum { |d, i| i.even? ? d : d * 3 }
    (sum % 10).zero?
  end
end
