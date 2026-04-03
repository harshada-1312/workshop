class CreateAuthors < ActiveRecord::Migration[7.2]
  def change
    create_table :authors do |t|
      t.string :first_name, null: false, limit: 100
      t.string :last_name, null: false, limit: 100
      t.text :bio
      t.integer :birth_year
      t.integer :death_year
      t.string :website, limit: 500

      t.timestamps
    end

    add_index :authors, :last_name
    add_index :authors, [:last_name, :first_name]
  end
end
