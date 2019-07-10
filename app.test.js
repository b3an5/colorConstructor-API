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

    it("should return a status of 404 if project id doesnt exist", async () => {
      const res = await request(app).get(`/api/v1/projects/50`);

      expect(res.status).toBe(404);
    });

    it("should return a status of 500 if project id is NaN", async () => {
      const res = await request(app).get(`/api/v1/projects/nwfejnn`);

      expect(res.status).toBe(500);
    });

    it("should return a status of 404 if palette id doesnt exist", async () => {
      const res = await request(app).get(`/api/v1/palettes/10000`);

      expect(res.status).toBe(404);
    });

    it("should return a status of 500 if palette id is NaN", async () => {
      const res = await request(app).get(`/api/v1/palettes/nwovn`);

      expect(res.status).toBe(500);
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

  describe("post methods", () => {
    it("should be able to post projects", async () => {
      const newProject = { name: "johnathan" };

      const response = await request(app)
        .post("/api/v1/projects")
        .send(newProject);
      const id = response.body.id;
      const project = await database("projects")
        .where("id", id)
        .first();

      //expectation
      expect(newProject.name).toEqual(project.name);
    });

    it("should not be able to post projects if no name is given", async () => {
      const newProject = { nam: "johnathan" };

      const response = await request(app)
        .post("/api/v1/projects")
        .send(newProject);

      //expectation
      expect(response.status).toBe(422);
    });

    it("should be able to post palettes", async () => {
      const project = await database("projects").first();

      const newPallete = {
        name: "john",
        color_1: "fffff",
        color_2: "fffff",
        color_3: "fffff",
        color_4: "fffff",
        color_5: "fffff",
        project_id: project.id
      };

      const response = await request(app)
        .post("/api/v1/palettes")
        .send(newPallete);
      const id = response.body.id;
      const palette = await database("palettes")
        .where("id", id)
        .first();

      expect(newPallete.name).toEqual(palette.name);
    });

    it("should not be able to post palettes if color isnt passed in", async () => {
      const project = await database("projects").first();

      const newPallete = {
        name: "john",
        color_2: "fffff",
        color_3: "fffff",
        color_4: "fffff",
        color_5: "fffff",
        project_id: project.id
      };

      const response = await request(app)
        .post("/api/v1/palettes")
        .send(newPallete);

      expect(response.status).toBe(422);
    });
    it("should not be able to post palettes if name isnt passed in", async () => {
      const project = await database("projects").first();

      const newPallete = {
        color_2: "fffff",
        color_3: "fffff",
        color_4: "fffff",
        color_5: "fffff",
        project_id: project.id
      };

      const response = await request(app)
        .post("/api/v1/palettes")
        .send(newPallete);

      expect(response.status).toBe(422);
    });
    it("should not be able to post palettes if project_id isnt passed in", async () => {
      const project = await database("projects").first();

      const newPallete = {
        name: "john",
        color_2: "fffff",
        color_3: "fffff",
        color_4: "fffff",
        color_5: "fffff"
      };

      const response = await request(app)
        .post("/api/v1/palettes")
        .send(newPallete);

      expect(response.status).toBe(422);
    });
  });

  describe("Patch methods", () => {
    it("should be able to patch a project", async () => {
      const expectedProject = await database("projects").first();
      const id = expectedProject.id;
      let newNameProject = expectedProject;
      newNameProject.name = "Theo";

      const response = await request(app)
        .patch(`/api/v1/projects/${id}`)
        .send(newNameProject);

      expect(newNameProject.name).toEqual(response.body.name);
    });

    it("shouldnt be able to patch a project if no new name is provided", async () => {
      const expectedProject = await database("projects").first();
      const id = expectedProject.id;
      let newNameProject = expectedProject;
      newNameProject.name = null;

      const response = await request(app)
        .patch(`/api/v1/projects/${id}`)
        .send(newNameProject);

      expect(response.status).toBe(422);
    });

    it("should be able to patch a palette", async () => {
      const expectedPalette = await database("palettes").first();
      const id = expectedPalette.id;
      let newNamePalette = expectedPalette;
      newNamePalette.name = "Theo";

      const response = await request(app)
        .patch(`/api/v1/palettes/${id}`)
        .send(newNamePalette);

      expect(newNamePalette.name).toEqual(response.body.name);
    });

    it("shouldnt be able to patch a palette if there isnt a name", async () => {
      const expectedPalette = await database("palettes").first();
      const id = expectedPalette.id;
      let newNamePalette = expectedPalette;
      newNamePalette.name = null;

      const response = await request(app)
        .patch(`/api/v1/palettes/${id}`)
        .send(newNamePalette);

      expect(response.status).toEqual(422);
    });
  });

  describe("delete methods", () => {
    it("should delete a palette", async () => {
      const palette = await database("palettes").first();
      const id = palette.id;

      const deleted = await request(app).delete(`/api/v1/palettes/${id}`);

      deleted;

      const deletedPalette = await database("palettes")
        .where("id", id)
        .first();

      expect(deletedPalette).toEqual(undefined);
    });
    it("should delete a project", async () => {
      const newProject = { name: "johnathan" };

      const response = await request(app)
        .post("/api/v1/projects")
        .send(newProject);
      const id = response.body.id;

      const deleted = await request(app).delete(`/api/v1/projects/${id}`);

      deleted;

      const deletedProject = await database("projects")
        .where("id", id)
        .first();

      expect(deletedProject).toEqual(undefined);
    });
  });
});
