module Api
  class BaseController < ActionController::API
    before_action :check_content_type, only: [:create, :update]

    rescue_from StandardError do |e|
      Rails.logger.error("Unhandled: #{e.class} - #{e.message}\n#{e.backtrace&.first(10)&.join("\n")}")
      render_error(code: "INTERNAL_ERROR", message: "An unexpected error occurred", status: :internal_server_error)
    end

    rescue_from ApplicationError do |e|
      render_error(code: e.code, message: e.message, details: e.details, status: e.status)
    end

    rescue_from ActiveRecord::RecordNotFound do |e|
      render_error(code: "NOT_FOUND", message: e.message, status: :not_found)
    end

    rescue_from ActionDispatch::Http::Parameters::ParseError do
      render_error(code: "BAD_REQUEST", message: "Invalid JSON in request body", status: :bad_request)
    end

    private

    def render_success(data, meta: nil, status: :ok)
      body = { data: data }
      body[:meta] = meta if meta
      render json: body, status: status
    end

    def render_error(code:, message:, details: nil, status:)
      body = { error: { code: code, message: message } }
      body[:error][:details] = details if details
      render json: body, status: status
    end

    def render_validation_errors(model)
      details = model.errors.map { |error| { field: error.attribute.to_s, message: error.message } }
      render_error(code: "VALIDATION_ERROR", message: "Validation failed", details: details, status: :unprocessable_entity)
    end

    def paginate(scope)
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || 20).to_i

      raise BadRequestError, "page must be greater than 0" if page < 1
      raise BadRequestError, "per_page must be between 1 and 100" if per_page < 1 || per_page > 100

      paginated = scope.page(page).per(per_page)

      meta = {
        page: page,
        per_page: per_page,
        total_items: paginated.total_count,
        total_pages: paginated.total_pages
      }

      [paginated, meta]
    end

    def apply_sort(scope, allowed_sorts, default_sort, default_order = "asc")
      sort_by = allowed_sorts[params[:sort_by]] || allowed_sorts[default_sort]
      sort_order = %w[asc desc].include?(params[:sort_order]) ? params[:sort_order] : default_order
      scope.order(Arel.sql("#{sort_by} #{sort_order}"))
    end

    def check_content_type
      return if request.content_type&.include?("application/json")
      render_error(code: "BAD_REQUEST", message: "Content-Type must be application/json", status: :bad_request)
    end
  end
end
