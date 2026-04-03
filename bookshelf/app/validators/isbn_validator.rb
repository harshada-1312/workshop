require_relative '../../lib/isbn'

class IsbnValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.nil?
    unless Isbn.valid?(value)
      record.errors.add(attribute, "is not a valid ISBN-13")
    end
  end
end
