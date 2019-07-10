const express = require("express");
const cors = require("cors");
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.get("/api/v1/projects", async (req, res) => {
  const projects = await database("projects").select();
  try {
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/api/v1/palettes", async (req, res) => {
  const palettes = await database("palettes").select();
  try {
    res.status(200).json(palettes);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/api/v1/projects/:id", async (req, res) => {
  try {
    const project = await database("projects")
      .where("id", req.params.id)
      .select();
    if (!project.length) {
      return res.status(404).json({
        error: `cound not find project with id: ${req.params.id}`
      });
    } else {
      res.status(200).json(project);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/api/v1/palettes/:id", async (req, res) => {
  try {
    const palette = await database("palettes")
      .where("id", req.params.id)
      .select();
    if (!palette.length) {
      return res.status(404).json({
        error: `cound not find palette with id: ${req.params.id}`
      });
    } else {
      return res.status(200).json(palette);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/api/v1/projects", (req, res) => {
  const { name } = req.body;
  const project = req.body;

  if (!name) {
    return res.status(422).json(`please enter a name for your project`);
  } else {
    database("projects")
      .insert(project, "id")
      .then(project => {
        res.status(201).json({ name, id: project[0] });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }
});

app.post("/api/v1/palettes", (req, res) => {
  const {
    name,
    color_1,
    color_2,
    color_3,
    color_4,
    color_5,
    project_id
  } = req.body;
  const palette = req.body;

  if (
    !name ||
    !color_1 ||
    !color_2 ||
    !color_3 ||
    !color_4 ||
    !color_5 ||
    !project_id
  ) {
    return res.status(422).json();
  } else {
    database("palettes")
      .insert(palette, "id")
      .then(palette => {
        res.status(201).json({ ...req.body, id: palette[0] });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }
});

app.patch("/api/v1/projects/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const newProject = req.body;

  if (!name) return res.status(422).json("Please provide a name.");

  database("projects")
    .where({ id })
    .update({ name })
    .then(res.status(200).json(newProject))
    .catch(error => res.status(500).json({ error }));
});

app.patch("/api/v1/palettes/:id", (req, res) => {
  const { id } = req.params;
  const { name, color_1, color_2, color_3, color_4, color_5 } = req.body;
  const newPalette = req.body;

  if (!name) return res.status(422).json("Please provide a name.");

  database("palettes")
    .where({ id })
    .update({ name, color_1, color_2, color_3, color_4, color_5 })
    .then(res.status(200).json(newPalette))
    .catch(error => res.status(500).json({ error }));
});

app.delete("/api/v1/projects/:id", (req, res) => {
  const { id } = req.params;

  database("projects")
    .where("id", id)
    .del()
    .then(result => {
      if (!result) {
        res
          .status(404)
          .json(
            `I'm sorry that id doesn't exist in projects table, maybe this is good news seeing you were trying to delete it anyway.`
          );
      } else {
        res.status(200).json(`id: ${id} deleted`);
      }
    });
});

app.delete("/api/v1/palettes/:id", (req, res) => {
  const { id } = req.params;

  database("palettes")
    .where("id", id)
    .del()
    .then(result => {
      if (!result) {
        res
          .status(404)
          .json(
            `I'm sorry that id doesn't exist in palettes table, maybe this is good news seeing you were trying to delete it anyway.`
          );
      } else {
        res.status(200).json(`id: ${id} deleted`);
      }
    });
});

module.exports = app;
