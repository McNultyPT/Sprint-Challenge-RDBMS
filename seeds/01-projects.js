
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('projects')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('projects').insert([
        {name: 'Project 1', description: 'This is a description', completed: false},
        {name: 'Project 2', description: 'This is a description for another project.', completed: false},
        {name: 'Project 3', description: 'This is a description for a different project.', completed: false}
      ]);
    });
};
