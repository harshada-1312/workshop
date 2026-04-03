# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

BookShelf — a personal library management REST API built with Ruby on Rails 7.1+ (API-only mode). Manages authors, books, and collections with full CRUD, search, and statistics endpoints.

## Key Documents

- `specification.md` — complete product spec: entities, API contracts, business rules, error formats, testing requirements
- `engineering.md` — architecture decisions, database design, gem choices, patterns, implementation phases

## Tech Stack

- Ruby on Rails (API-only, no views/assets)
- SQLite (dev/test), swappable to PostgreSQL
- Alba (serialization), Kaminari (pagination), Rack-CORS
- RSpec, FactoryBot, Shoulda Matchers, DatabaseCleaner

## Build & Run Commands

```bash
bin/rails server                    # Start dev server
bundle exec rspec                   # Run full test suite
bundle exec rspec spec/requests/    # Run integration tests only
bundle exec rspec spec/models/      # Run model tests only
bundle exec rspec spec/requests/books_spec.rb:42  # Run single test by line
bin/rails db:migrate                # Run migrations
bin/rails db:seed                   # Load seed data
```

## Architecture

- **JSON envelope** — all responses wrapped: `{ "data": ..., "meta": ... }` for success, `{ "error": { "code": ..., "message": ..., "details": [...] } }` for errors. Rendering goes through `render_success`/`render_error` in `Api::BaseController`.
- **Controllers** inherit from `Api::BaseController` which provides: envelope rendering, pagination helpers, sorting with whitelist, global `rescue_from` error handling.
- **Serializers** in `app/serializers/` — list vs detail variants per resource (e.g., `BookSerializer` for lists, `BookDetailSerializer` for show with embedded author).
- **Services** in `app/services/` — only for multi-step logic: `Collections::AddBook`, `Collections::RemoveBook`, `Collections::ReorderBooks`, `SearchService`, `StatsService`.
- **Custom validators** in `app/validators/` — `IsbnValidator` (delegates to `lib/isbn.rb`), `RatingValidator` (0.5 increments).
- **Error classes** in `app/errors/` — `ApplicationError` hierarchy mapped to spec error codes (NOT_FOUND, CONFLICT, DEPENDENCY_EXISTS, BAD_REQUEST).
- **Sanitizable concern** — strips whitespace and HTML from all string/text fields before validation.

## Business Rules to Remember

- Authors cannot be deleted if they have books (returns 409 DEPENDENCY_EXISTS)
- ISBN-13 must pass check digit algorithm and be unique
- Rating must be in 0.5 increments (0, 0.5, 1.0 ... 5.0)
- Collection book positions must stay contiguous (renumber after removal)
- Reorder endpoint requires exact same set of book IDs currently in the collection
- Book deletion cascades to remove from all collections (DB-level ON DELETE CASCADE)
- Uniqueness conflicts (ISBN, collection name) return 409 CONFLICT, not 422
