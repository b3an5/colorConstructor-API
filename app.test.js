const request = require("supertest");
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

const app = require("./app");

describe("Server", () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe("init", () => {
    it("should return a 200 status", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
    });
  });

  describe("GET methods", () => {
    it("should return all the projects in the DB", async () => {
      // setup
      const expectedProjects = await database("projects").select();
      expectedProjects.forEach(project => {
        project.created_at = project.created_at.toJSON();
        project.updated_at = project.updated_at.toJSON();
      });
      // execution
      const res = await request(app).get("/api/v1/projects");
      const projects = res.body;

      // expectation
      expect(projects).toEqual(expectedProjects);
    });

    it("should get all palettes in the DB", async () => {
      const expectedPalettes = await database("palettes").select();
      expectedPalettes.forEach(palette => {
        palette.created_at = palette.created_at.toJSON();
        palette.updated_at = palette.updated_at.toJSON();
      });

      const res = await request(app).get("/api/v1/palettes");
      const palettes = res.body;

      expect(palettes).toEqual(expectedPalettes);
    });

    it("should get the specific project", async () => {
      const expectedProject = await database("projects")
        .select()
        .first();
      expectedProject.created_at = expectedProject.created_at.toJSON();
      expectedProject.updated_at = expectedProject.updated_at.toJSON();
      const id = expectedProject.id;

      const res = await request(app).get(`/api/v1/projects/${id}`);
      const project = res.body[0];

      expect(project).toEqual(expectedProject);
    });

    it("should get the specific palette", async () => {
      const expectedPalette = await database("palettes")
        .select()
        .first();
      expectedPalette.created_at = expectedPalette.created_at.toJSON();
      expectedPalette.updated_at = expectedPalette.updated_at.toJSON();
      const id = expectedPalette.id;

      const res = await request(app).get(`/api/v1/palettes/${id}`);
      const palette = res.body[0];

      expect(palette).toEqual(expectedPalette);
    });
  });

  describe("post methods", () => {});
});
