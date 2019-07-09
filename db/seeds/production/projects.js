exports.seed = function(knex) {
  return knex("palettes")
    .del()
    .then(() => knex("projects").del())
    .then(() => {
      let projectPromises = [];

      seedData.forEach(project => {
        projectPromises.push(createProjects(knex, project));
      });
      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`error: ${error}`));
};
