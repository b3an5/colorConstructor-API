const request = require("supertest");
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

const app = require("./app");

describe("Server", () => {
  beforeEach(async () => {
    await database.seed.run();
    const projects = await database("projects").select()
    projects.forEach(project => project.created_at.toJSON())
  });

  describe("init", () => {
    it("should return a 200 status", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /projects", () => {
    it("should return all the projects in the DB", async () => {
      // setup
      const expectedProjects = await database("projects").select();
      
      // execution
      const res = await request(app).get("/api/v1/projects");
      const {created_at, updated_at} = res.body[0];
      const result = {...res.body[0], created_at: created_at, updated_at: updated_at};

      // expectation
      expect([result]).toEqual(expectedProjects);
    });
  });
});
