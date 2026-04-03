class DependencyExistsError < ApplicationError
  def initialize(message)
    super(message, code: "DEPENDENCY_EXISTS", status: :conflict)
  end
end
