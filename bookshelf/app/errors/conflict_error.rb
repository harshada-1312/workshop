class ConflictError < ApplicationError
  def initialize(message)
    super(message, code: "CONFLICT", status: :conflict)
  end
end
