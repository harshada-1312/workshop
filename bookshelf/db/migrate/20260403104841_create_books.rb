class CreateBooks < ActiveRecord::Migration[7.2]
  def change
    create_table :books do |t|
      t.string :title, null: false, limit: 300
      t.string :isbn, limit: 13
      t.references :author, null: false, foreign_key: { on_delete: :restrict }
      t.integer :published_year
      t.string :genre, null: false, limit: 50
      t.text :description
      t.integer :page_count
      t.string :language, null: false, limit: 2, default: "en"
      t.decimal :rating, precision: 2, scale: 1
      t.string :read_status, null: false, limit: 10, default: "unread"
      t.datetime :date_added, null: false

      t.timestamps
    end

    add_index :books, :isbn, unique: true, where: "isbn IS NOT NULL"
    add_index :books, :genre
    add_index :books, :read_status
    add_index :books, :language
    add_index :books, :date_added
    add_index :books, :rating
    add_index :books, :published_year
  end
end
