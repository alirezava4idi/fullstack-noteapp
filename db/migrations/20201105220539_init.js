const Knex = require('knex')


function addDefaultColumns(table){
    table.timestamps(false, true);
    table.datetime('deleted_at');
}

/**
 * @param {Knex} knex 
 */
exports.up = async (knex) => {
  return knex.schema.createTable('user', (table) => {
      table.increments().unsigned().primary().notNullable(),
      table.string('email', 254).notNullable().unique(),
      table.string('password', 127).notNullable()
      addDefaultColumns(table)
  }).then(() => {
      return knex.schema.createTable('sessions', (table) => {
        table.increments().unsigned().primary().notNullable(),
        table.integer('user_id').unsigned().notNullable().references('id').inTable('user').onDelete('CASCADE')
        table.string('session', 255).notNullable()
      })
  }).then(() => {
    return knex.schema.createTable('note', (table) => {
      table.increments().unsigned().primary().notNullable(),
      table.integer('user_id').unsigned().notNullable().references('id').inTable('user').onDelete('CASCADE')
      table.text('content')
      addDefaultColumns(table)
    })
  })

  
};

/**
 * @param {Knex} knex 
 */
exports.down = async (knex) => {
  await knex.schema.dropTable('sessions')
  await knex.schema.dropTable('note')
  await knex.schema.dropTable('user')
};
