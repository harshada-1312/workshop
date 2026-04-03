# BookShelf — Engineering Plan

**Version:** 1.0
**Date:** April 2026
**Stack:** Ruby on Rails 7.1+ (API-only)

---

## 1. Architecture Overview

### Application Mode

Rails 7.1+ in **API-only mode** (`rails new bookshelf --api -T`). No views, no asset pipeline, no cookie middleware. The app serves JSON exclusively. Minitest is skipped (`-T`) in favor of RSpec.

### Architectural Patterns

| Layer | Responsibility |
|-------|---------------|
| **Models** | Associations, database-level validations, scopes, simple queries |
| **Serializers** | Transform models into the JSON envelope format (list vs. detail variants) |
| **Controllers** | Thin — parse params, call model/service, render through serializer. All inherit from `Api::BaseController` |
| **Services** | Multi-step orchestration that doesn't belong in a model: collection position management, unified search, statistics aggregation. Plain Ruby classes, no framework |
| **Validators** | Custom ActiveModel validators for ISBN-13 check digit and rating increment validation |
| **Error classes** | Custom exception hierarchy for consistent error envelope rendering |

No form objects. No decorator pattern. No concerns beyond `Sanitizable`. Keep the layer count low for v1.

---

## 2. Folder Structure

```
bookshelf/
├── app/
│   ├── controllers/
│   │   └── api/
│   │       ├── base_controller.rb            # Envelope rendering, pagination, sorting, error handling
│   │       ├── authors_controller.rb
│   │       ├── books_controller.rb
│   │       ├── collections_controller.rb
│   │       ├── collection_books_controller.rb # Add/remove/reorder books within a collection
│   │       ├── search_controller.rb
│   │       └── stats_controller.rb
│   ├── models/
│   │   ├── application_record.rb
│   │   ├── concerns/
│   │   │   └── sanitizable.rb                # Whitespace trimming + HTML stripping
│   │   ├── author.rb
│   │   ├── book.rb
│   │   ├── collection.rb
│   │   └── collection_book.rb                # Join model with position
│   ├── serializers/
│   │   ├── author_serializer.rb              # List view (with book_count)
│   │   ├── author_detail_serializer.rb       # Show view (with book_count + recent_books)
│   │   ├── book_serializer.rb                # List view (with author_name)
│   │   ├── book_detail_serializer.rb         # Show view (with full embedded author)
│   │   ├── collection_serializer.rb          # List view (with book_count)
│   │   ├── collection_detail_serializer.rb   # Show view (with ordered books)
│   │   └── search_result_serializer.rb       # Optional — search and stats may render plain hashes directly
│   │                                          # since their response shapes don't map to single models
│   ├── services/
│   │   ├── collections/
│   │   │   ├── add_book.rb
│   │   │   ├── remove_book.rb
│   │   │   └── reorder_books.rb
│   │   ├── search_service.rb
│   │   └── stats_service.rb
│   ├── validators/
│   │   ├── isbn_validator.rb
│   │   └── rating_validator.rb
│   └── errors/
│       ├── application_error.rb
│       ├── not_found_error.rb
│       ├── conflict_error.rb
│       ├── dependency_exists_error.rb
│       └── bad_request_error.rb
├── config/
│   └── routes.rb
├── db/
│   ├── migrate/
│   ├── seeds.rb
│   └── seeds/
│       ├── authors.rb
│       ├── books.rb
│       └── collections.rb
├── lib/
│   └── isbn.rb                               # Pure ISBN-13 check digit logic
└── spec/
    ├── models/
    ├── requests/                              # Integration tests per endpoint
    ├── services/
    ├── validators/
    ├── lib/
    ├── factories/
    │   ├── authors.rb
    │   ├── books.rb
    │   ├── collections.rb
    │   └── collection_books.rb
    ├── support/
    │   └── request_helpers.rb                 # json_body, json_data, json_error, json_meta
    ├── rails_helper.rb
    └── spec_helper.rb
```

---

## 3. Gem Selection

### Runtime

| Gem | Purpose |
|-----|---------|
| `alba` | JSON serialization. Fast, zero dependencies, simple DSL. Preferred over jbuilder (slow) and jsonapi-serializer (too opinionated for a custom envelope). |
| `kaminari` | Pagination. Mature, well-maintained, integrates cleanly with ActiveRecord scopes. |
| `rack-cors` | CORS headers for future frontend clients. Configured in `config/initializers/cors.rb` (see below). |

### Development + Test

| Gem | Purpose |
|-----|---------|
| `rspec-rails` | Test framework. |
| `factory_bot_rails` | Test data factories. |
| `shoulda-matchers` | One-liner model validation/association specs. |
| `database_cleaner-active_record` | Clean state between test runs. |
| `faker` | Generate realistic seed and test data. |

### Database

**SQLite** for development/test (Rails default). The schema uses no database-specific features, making it easily swappable to PostgreSQL for production.

### CORS Configuration

`config/initializers/cors.rb`:

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "*"   # Lock down to specific origins in production
    resource "/api/*",
      headers: :any,
      methods: [:get, :post, :put, :delete, :options],
      max_age: 600
  end
end
```

For v1 development, allow all origins. Tighten before any production deployment.

### Gems NOT Used (and why)

- `active_model_serializers` — abandoned/unmaintained
- `pundit` / `cancancan` — no auth in v1
- `ransack` — filtering is simple enough to hand-roll with scopes
- `acts_as_list` — position management is ~30 lines; not worth a dependency

---

## 4. Database Design

### 4.1 `authors`

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK, auto-increment |
| first_name | string(100) | NOT NULL |
| last_name | string(100) | NOT NULL |
| bio | text | nullable |
| birth_year | integer | nullable |
| death_year | integer | nullable |
| website | string(500) | nullable |
| created_at | datetime | NOT NULL |
| updated_at | datetime | NOT NULL |

**Indexes:**
- `index_authors_on_last_name` — default sort
- `index_authors_on_last_name_and_first_name` — search filtering

### 4.2 `books`

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK, auto-increment |
| title | string(300) | NOT NULL |
| isbn | string(13) | nullable, UNIQUE |
| author_id | bigint | NOT NULL, FK → authors(id) |
| published_year | integer | nullable |
| genre | string(50) | NOT NULL |
| description | text | nullable |
| page_count | integer | nullable |
| language | string(2) | NOT NULL, default "en" |
| rating | decimal(2,1) | nullable |
| read_status | string(10) | NOT NULL, default "unread" |
| date_added | datetime | NOT NULL |
| created_at | datetime | NOT NULL |
| updated_at | datetime | NOT NULL |

**Indexes:**
- `index_books_on_author_id` — FK lookup
- `index_books_on_isbn` (UNIQUE, partial: where isbn IS NOT NULL)
- `index_books_on_genre` — filter
- `index_books_on_read_status` — filter
- `index_books_on_language` — filter
- `index_books_on_date_added` — default sort
- `index_books_on_rating` — filter + sort
- `index_books_on_published_year` — filter + sort

### 4.3 `collections`

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK, auto-increment |
| name | string(200) | NOT NULL, UNIQUE |
| description | text | nullable |
| is_public | boolean | NOT NULL, default false |
| created_at | datetime | NOT NULL |
| updated_at | datetime | NOT NULL |

**Indexes:**
- `index_collections_on_name` (UNIQUE)

### 4.4 `collection_books` (join table)

| Column | Type | Constraints |
|--------|------|-------------|
| id | bigint | PK, auto-increment |
| collection_id | bigint | NOT NULL, FK → collections(id) ON DELETE CASCADE |
| book_id | bigint | NOT NULL, FK → books(id) ON DELETE CASCADE |
| position | integer | NOT NULL |
| created_at | datetime | NOT NULL |

**Indexes:**
- `index_collection_books_on_collection_id_and_book_id` (UNIQUE) — prevents duplicates
- `index_collection_books_on_collection_id_and_position` — ordered retrieval
- `index_collection_books_on_book_id` — reverse lookup for cascade

### 4.5 Foreign Key Behavior

| FK | ON DELETE |
|----|-----------|
| `collection_books.book_id` → `books.id` | CASCADE — deleting a book removes it from all collections |
| `collection_books.collection_id` → `collections.id` | CASCADE — deleting a collection removes all associations |
| `books.author_id` → `authors.id` | RESTRICT — enforced at both DB and app level |

---

## 5. Key Patterns

### 5.1 JSON Envelope

All rendering goes through two helper methods in `Api::BaseController`:

```ruby
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
```

Every controller action calls `render_success` with serialized data. No controller ever calls `render json:` directly.

### 5.2 Pagination

Shared method in `BaseController`:

```ruby
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
```

**Edge cases:** `page=0` and `per_page=0` return 400 `BAD_REQUEST`. `per_page` above 100 also returns 400. Page beyond total returns empty `data` array with correct meta.

### 5.3 Sorting

Each controller defines a whitelist of allowed sort fields as a constant hash mapping param strings to column expressions:

```ruby
ALLOWED_SORTS = {
  "last_name" => "authors.last_name",
  "first_name" => "authors.first_name",
  "created_at" => "authors.created_at",
  "book_count" => "book_count"
}.freeze
```

`BaseController` provides:

```ruby
def apply_sort(scope, allowed_sorts, default_sort, default_order = "asc")
  sort_by = allowed_sorts[params[:sort_by]] || allowed_sorts[default_sort]
  sort_order = %w[asc desc].include?(params[:sort_order]) ? params[:sort_order] : default_order
  scope.order(Arel.sql("#{sort_by} #{sort_order}"))
end
```

For `book_count` sorting on authors: use `Author.left_joins(:books).group(:id).select("authors.*, COUNT(books.id) AS book_count")`.

### 5.4 Filtering

Each list controller defines a private method that chains ActiveRecord scopes. No DSLs — straightforward scope chaining:

```ruby
def apply_filters(scope)
  scope = scope.where(genre: params[:genre]) if params[:genre].present?
  scope = scope.where(read_status: params[:read_status]) if params[:read_status].present?
  scope = scope.where(author_id: params[:author_id]) if params[:author_id].present?
  scope = scope.where(language: params[:language]) if params[:language].present?
  scope = scope.where("rating >= ?", params[:rating_min]) if params[:rating_min].present?
  scope = scope.where("rating <= ?", params[:rating_max]) if params[:rating_max].present?
  scope = scope.where("published_year >= ?", params[:published_year_min]) if params[:published_year_min].present?
  scope = scope.where("published_year <= ?", params[:published_year_max]) if params[:published_year_max].present?
  if params[:search].present?
    term = "%#{params[:search]}%"
    scope = scope.where("title LIKE :q OR description LIKE :q", q: term)
  end
  scope
end
```

#### Collections Filtering

```ruby
def apply_filters(scope)
  scope = scope.where(is_public: params[:is_public]) if params[:is_public].present?
  if params[:search].present?
    term = "%#{params[:search]}%"
    scope = scope.where("name LIKE :q OR description LIKE :q", q: term)
  end
  scope
end
```

### 5.5 ISBN-13 Validation

Pure Ruby module at `lib/isbn.rb`:

```ruby
module Isbn
  def self.valid?(isbn_string)
    return false unless isbn_string.match?(/\A\d{13}\z/)
    digits = isbn_string.chars.map(&:to_i)
    sum = digits.each_with_index.sum { |d, i| i.even? ? d : d * 3 }
    (sum % 10).zero?
  end
end
```

Custom ActiveModel validator at `app/validators/isbn_validator.rb` calls `Isbn.valid?` and adds a `:isbn` field error if it fails. The model also validates `uniqueness: true, allow_nil: true`.

### 5.6 Rating Validation

Custom validator at `app/validators/rating_validator.rb`:

```ruby
class RatingValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.nil?
    unless value >= 0 && value <= 5.0 && (value * 2) % 1 == 0
      record.errors.add(attribute, "must be between 0 and 5 in 0.5 increments")
    end
  end
end
```

### 5.7 Collection Position Management

**Adding a book** — `Collections::AddBook` service:
- Inside a transaction: validate book exists and is not already in collection
- Find `max_position = collection.collection_books.maximum(:position) || 0`
- Create `CollectionBook` with `position: max_position + 1`

**Removing a book** — `Collections::RemoveBook` service:
- Inside a transaction: find and destroy the `CollectionBook` record
- Renumber remaining positions to stay contiguous:

```ruby
collection.collection_books.order(:position).each_with_index do |cb, idx|
  cb.update_column(:position, idx + 1) if cb.position != idx + 1
end
```

**Reordering** — `Collections::ReorderBooks` service:
- Validate that `book_ids` array contains exactly the same set of book IDs currently in the collection (using `Set` comparison)
- In a transaction, assign new positions:

```ruby
book_ids.each_with_index do |book_id, idx|
  collection.collection_books.find_by!(book_id: book_id).update_column(:position, idx + 1)
end
```

### 5.8 Input Sanitization

A `Sanitizable` concern mixed into all three models:

```ruby
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
```

Content-Type validation via `before_action` in `BaseController`:

```ruby
before_action :check_content_type, only: [:create, :update]

private

def check_content_type
  return if request.content_type&.include?("application/json")
  render_error(code: "BAD_REQUEST", message: "Content-Type must be application/json", status: :bad_request)
end
```

Returns 400 `BAD_REQUEST` on POST/PUT requests without `application/json` Content-Type.

---

## 6. Error Handling

### 6.1 Custom Exception Hierarchy

```ruby
class ApplicationError < StandardError
  attr_reader :code, :status, :details
  def initialize(message, code:, status:, details: nil)
    super(message)
    @code = code
    @status = status
    @details = details
  end
end

class NotFoundError < ApplicationError
  def initialize(message = "Resource not found")
    super(message, code: "NOT_FOUND", status: :not_found)
  end
end

class ConflictError < ApplicationError
  def initialize(message)
    super(message, code: "CONFLICT", status: :conflict)
  end
end

class DependencyExistsError < ApplicationError
  def initialize(message)
    super(message, code: "DEPENDENCY_EXISTS", status: :conflict)
  end
end

class BadRequestError < ApplicationError
  def initialize(message = "Bad request")
    super(message, code: "BAD_REQUEST", status: :bad_request)
  end
end
```

### 6.2 Global Rescue in BaseController

```ruby
class Api::BaseController < ActionController::API
  rescue_from ApplicationError do |e|
    render_error(code: e.code, message: e.message, details: e.details, status: e.status)
  end

  rescue_from ActiveRecord::RecordNotFound do |e|
    render_error(code: "NOT_FOUND", message: e.message, status: :not_found)
  end

  rescue_from ActionDispatch::Http::Parameters::ParseError do
    render_error(code: "BAD_REQUEST", message: "Invalid JSON in request body", status: :bad_request)
  end

  rescue_from StandardError do |e|
    Rails.logger.error("Unhandled: #{e.class} - #{e.message}\n#{e.backtrace&.first(10)&.join("\n")}")
    render_error(code: "INTERNAL_ERROR", message: "An unexpected error occurred", status: :internal_server_error)
  end
end
```

### 6.3 Validation Error Rendering

```ruby
def render_validation_errors(model)
  details = model.errors.map { |error| { field: error.attribute.to_s, message: error.message } }
  render_error(code: "VALIDATION_ERROR", message: "Validation failed", details: details, status: :unprocessable_entity)
end
```

### 6.4 Conflict Detection

ISBN and collection name uniqueness are enforced at both the DB level (unique index) and model level. After `save` returns false, inspect `model.errors` — if the only error is a uniqueness violation on `isbn` or `name`, render 409 `CONFLICT` instead of 422.

---

## 7. Routes

```ruby
Rails.application.routes.draw do
  namespace :api do
    resources :authors, only: [:index, :show, :create, :update, :destroy] do
      get :books, on: :member       # GET /api/authors/:id/books — supports same sorting/filtering as BooksController#index
    end

    resources :books, only: [:index, :show, :create, :update, :destroy]

    resources :collections, only: [:index, :show, :create, :update, :destroy] do
      member do
        post   "books",          to: "collection_books#create"
        delete "books/:book_id", to: "collection_books#destroy"
        put    "books/reorder",  to: "collection_books#reorder"
      end
    end

    get "search", to: "search#index"
    get "stats",  to: "stats#index"
  end
end
```

---

## 8. Search Implementation

`SearchService` accepts `q`, `type`, `page`, `per_page`. Runs separate queries per entity type with `LIKE` matching on the specified fields:

- **Books:** searches `title`, `description`, `isbn`
- **Authors:** searches `first_name`, `last_name`, `bio`
- **Collections:** searches `name`, `description`

When `type` is provided, only that query runs. Results are grouped by type in the response (not interleaved).

**Pagination behavior:**
- When `type` is specified: pagination (`page`, `per_page`) applies to that single type's results.
- When searching all types (no `type` param): each type returns up to `per_page` results independently (no combined pagination). The `meta.total_results` is the sum of all matched records across types, and `meta.counts` gives per-type totals.

For future full-text search, the `LIKE` queries can be swapped for `pg_search` or Elasticsearch without changing the service interface.

---

## 9. Stats Implementation

`StatsService` runs aggregate queries, all computed on the fly:

```ruby
{
  total_books: Book.count,
  total_authors: Author.count,
  total_collections: Collection.count,
  books_by_status: Book.group(:read_status).count,
  books_by_genre: Book.group(:genre).count
                      .sort_by { |_, v| -v }
                      .map { |g, c| { genre: g, count: c } },
  books_by_year: Book.where(published_year: (current_year - 9)..current_year)
                     .group(:published_year).count
                     .sort_by { |y, _| -y }
                     .map { |y, c| { year: y, count: c } },
  top_authors: Author.left_joins(:books).group(:id)
                     .order("COUNT(books.id) DESC").limit(10)
                     .select("authors.*, COUNT(books.id) as book_count"),
  average_rating: Book.where.not(rating: nil).average(:rating)&.round(1),
  total_pages: Book.sum(:page_count),
  average_pages_per_book: Book.where.not(page_count: nil).average(:page_count)&.round(0),
  language_distribution: Book.group(:language).count
                             .sort_by { |_, v| -v }
                             .map { |l, c| { language: l, count: c } }
}
```

For v1 with hundreds of records, these queries complete well under 500ms. No caching needed.

---

## 10. Testing Strategy

### 10.1 Framework and Setup

- **RSpec** with `rspec-rails`
- **FactoryBot** for all test data
- **Shoulda Matchers** for model validation one-liners
- **DatabaseCleaner** with transaction strategy

### 10.2 Factories

Located in `spec/factories/`:

- `authors.rb` — realistic names via Faker
- `books.rb` — titles, valid ISBNs, genres from the allowed list. Traits: `:with_isbn`, `:read`, `:reading`, `:unread`, `:rated`, `:unrated`
- `collections.rb` — unique names
- `collection_books.rb`

### 10.3 Test Organization

#### Unit Tests (`spec/models/`, `spec/validators/`, `spec/lib/`)

| File | Covers |
|------|--------|
| `author_spec.rb` | Validations (required fields, length limits, birth/death year logic, website format), associations, deletion protection |
| `book_spec.rb` | Validations (title, genre inclusion, ISBN format+uniqueness, rating increments, read_status inclusion, language, published_year range), associations, default values |
| `collection_spec.rb` | Validations (name required+unique, description length), associations |
| `collection_book_spec.rb` | Uniqueness of [collection_id, book_id], position presence |
| `isbn_spec.rb` | Valid ISBN passes, bad check digit fails, wrong length fails, non-numeric fails |
| `rating_validator_spec.rb` | 0, 0.5, 1.0...5.0 pass; 3.7, -1, 6, 5.1 fail |

#### Service Tests (`spec/services/`)

| File | Covers |
|------|--------|
| `collections/add_book_spec.rb` | Success, book already in collection, nonexistent book |
| `collections/remove_book_spec.rb` | Success, positions recomputed, book not in collection |
| `collections/reorder_books_spec.rb` | Valid reorder, mismatched IDs, duplicates, empty collection |
| `search_service_spec.rb` | Correct fields searched, type filter, minimum query length |
| `stats_service_spec.rb` | Empty database, single record, realistic data, correct rounding |

#### Integration Tests (`spec/requests/`)

| File | Covers |
|------|--------|
| `authors_spec.rb` | CRUD happy path, validation errors, 404, deletion with books (409), nested books, pagination, sorting (4 fields), search filter |
| `books_spec.rb` | CRUD happy path, validation errors (each field), ISBN conflict (409), 404, pagination, sorting (5 fields), all 9 filters individually and combined, partial update |
| `collections_spec.rb` | CRUD happy path, name conflict (409), 404, pagination, sorting, filtering |
| `collection_books_spec.rb` | Add book (201), duplicate add (409), remove + position recalc (204), reorder happy path, reorder with wrong IDs (422) |
| `search_spec.rb` | All types, single type, minimum query length, special characters, empty results |
| `stats_spec.rb` | Correct calculations, empty database edge case |
| `error_handling_spec.rb` | Malformed JSON (400), wrong content-type (400), internal error rendering |

### 10.4 Shared Test Helpers

`spec/support/request_helpers.rb`:

```ruby
module RequestHelpers
  def json_body
    JSON.parse(response.body, symbolize_names: true)
  end

  def json_data  = json_body[:data]
  def json_error = json_body[:error]
  def json_meta  = json_body[:meta]
end
```

Shared examples for pagination behavior, sorting behavior, and standard error responses to avoid repetition.

---

## 11. Seed Data

`db/seeds.rb` loads from structured files in `db/seeds/`:

| File | Content |
|------|---------|
| `authors.rb` | 12 authors: mix of classic (Austen, Tolkien, Garcia Marquez), modern (Ishiguro, Adichie), across genres. Realistic birth/death years and bios. |
| `books.rb` | 35 books distributed across authors. Real titles with valid ISBN-13s (correct check digits). All 20 genres represented. Mix of read statuses, ratings, and languages. |
| `collections.rb` | 6 collections: "All-Time Classics", "Science & Technology", "Latin American Literature", "2026 Reading List", "Short Reads (Under 200 Pages)", "Unread Pile". Realistic book assignments with deliberate overlap. |

Seeds use `find_or_create_by` on identifying fields — idempotent and safe to run multiple times.

---

## 12. Implementation Sequence

### Phase 1: Foundation
- `rails new bookshelf --api -T`
- Add all gems, `bundle install`
- `rails generate rspec:install`, configure FactoryBot, DatabaseCleaner, Shoulda
- Create `Api::BaseController` with envelope helpers and global error handling
- Create custom error classes in `app/errors/`
- Create `Sanitizable` concern
- Write request spec for content-type checking and malformed JSON

### Phase 2: Authors
- Migration for `authors` table
- `Author` model with validations, associations
- Serializers (list + detail)
- `AuthorsController` with full CRUD + nested books
- Routes
- Model specs + request specs

### Phase 3: Books
- `lib/isbn.rb` with unit tests
- `IsbnValidator` and `RatingValidator` with unit tests
- Migration for `books` table
- `Book` model with all validations, associations, scopes
- Serializers (list + detail)
- `BooksController` with CRUD, filtering, sorting
- Routes
- Model specs + request specs

### Phase 4: Collections
- Migrations for `collections` and `collection_books` tables
- `Collection` and `CollectionBook` models
- Service objects: `AddBook`, `RemoveBook`, `ReorderBooks`
- Serializers (list + detail)
- `CollectionsController` and `CollectionBooksController`
- Routes
- Model specs + service specs + request specs

### Phase 5: Search and Stats
- `SearchService` and `SearchController`
- `StatsService` and `StatsController`
- Routes
- Service specs + request specs

### Phase 6: Seed Data and Polish
- Create seed data files with valid ISBNs
- Run full test suite, fix edge cases
- Verify response times
- Review all error responses match spec format

---

## 13. Future-Proofing Notes (Not Implemented)

These features are out of scope but the architecture does not block them:

- **Multi-author books** — `author_id` FK can later become a `book_authors` join table
- **Authentication** — `BaseController` has no auth logic; adding `before_action :authenticate!` is straightforward
- **Tags** — New `tags` + `book_tags` join tables; no schema conflicts
- **Image uploads** — Add `cover_image` to books, use Active Storage
- **Import/export** — Service object pattern means CSV import reuses model validations
