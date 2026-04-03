module Sanitizable
  extend ActiveSupport::Concern

  included do
    before_validation :sanitize_text_fields
  end

  private

  def sanitize_text_fields
    self.class.columns.select { |c| [:string, :text].include?(c.type) }.each do |col|
      value = send(col.name)
      if value.is_a?(String)
        value = value.strip
        value = ActionController::Base.helpers.strip_tags(value)
        send("#{col.name}=", value)
      end
    end
  end
end
