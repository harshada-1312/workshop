class RatingValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.nil?
    unless value >= 0 && value <= 5.0 && (value * 2) % 1 == 0
      record.errors.add(attribute, "must be between 0 and 5 in 0.5 increments")
    end
  end
end
