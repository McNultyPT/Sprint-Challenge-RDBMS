
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('actions')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('actions').insert([
        {description: "Do this thing.", notes: "Do it like this.", completed: false, project_id: 1},
        {description: "No, do this thing.", notes: "Do it like this.", completed: false, project_id: 1},
        {description: "Or do this thing.", notes: "Do it like this.", completed: true, project_id: 1},
        {description: "Maybe do this thing?", notes: "Do it like this.", completed: false, project_id: 2},
        {description: "And do this thing.", notes: "Do it like this.", completed: false, project_id: 2},
        {description: "Scooby Doo?", notes: "Do it like this.", completed: true, project_id: 3},
        {description: "Now, do this thing.", notes: "Do it like this.", completed: false, project_id: 3},
      ]);
    });
};
