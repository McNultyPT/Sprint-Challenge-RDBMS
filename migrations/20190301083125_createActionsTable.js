
exports.up = function(knex, Promise) {
    return knex.schema.createTable('actions', function(tbl) {
        tbl.increments();

        tbl
            .integer('project_id')
            .unsigned()
            .references('id')
            .inTable('projects')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        tbl
            .string('description')
            .notNullable()
            .unique();

        tbl.string('notes');

        tbl.boolean('completed');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('actions');
};
