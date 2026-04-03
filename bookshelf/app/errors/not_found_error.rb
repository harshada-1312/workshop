class NotFoundError < ApplicationError
  def initialize(message = "Resource not found")
    super(message, code: "NOT_FOUND", status: :not_found)
  end
end
