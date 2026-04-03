class BadRequestError < ApplicationError
  def initialize(message = "Bad request")
    super(message, code: "BAD_REQUEST", status: :bad_request)
  end
end
