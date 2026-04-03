# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_04_03_104841) do
  create_table "authors", force: :cascade do |t|
    t.string "first_name", limit: 100, null: false
    t.string "last_name", limit: 100, null: false
    t.text "bio"
    t.integer "birth_year"
    t.integer "death_year"
    t.string "website", limit: 500
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["last_name", "first_name"], name: "index_authors_on_last_name_and_first_name"
    t.index ["last_name"], name: "index_authors_on_last_name"
  end

  create_table "books", force: :cascade do |t|
    t.string "title", limit: 300, null: false
    t.string "isbn", limit: 13
    t.integer "author_id", null: false
    t.integer "published_year"
    t.string "genre", limit: 50, null: false
    t.text "description"
    t.integer "page_count"
    t.string "language", limit: 2, default: "en", null: false
    t.decimal "rating", precision: 2, scale: 1
    t.string "read_status", limit: 10, default: "unread", null: false
    t.datetime "date_added", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_books_on_author_id"
    t.index ["date_added"], name: "index_books_on_date_added"
    t.index ["genre"], name: "index_books_on_genre"
    t.index ["isbn"], name: "index_books_on_isbn", unique: true, where: "isbn IS NOT NULL"
    t.index ["language"], name: "index_books_on_language"
    t.index ["published_year"], name: "index_books_on_published_year"
    t.index ["rating"], name: "index_books_on_rating"
    t.index ["read_status"], name: "index_books_on_read_status"
  end

  add_foreign_key "books", "authors", on_delete: :restrict
end
