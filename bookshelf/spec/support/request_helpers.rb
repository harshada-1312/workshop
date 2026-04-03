module RequestHelpers
  def json_body
    JSON.parse(response.body, symbolize_names: true)
  end

  def json_data  = json_body[:data]
  def json_error = json_body[:error]
  def json_meta  = json_body[:meta]
end
