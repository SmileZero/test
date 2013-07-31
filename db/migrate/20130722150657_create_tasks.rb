class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :title
      t.date :deadline
      t.datetime :remind
      t.text :remark
      t.boolean :isdone, :default => 0

      t.timestamps
    end
  end
end
