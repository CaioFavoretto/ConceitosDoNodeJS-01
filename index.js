const express = require("express");

const server = express();
server.use(express.json());

let requestAmt = 0;
const projects = [];

server.use((req, res, next) => {
  requestAmt++;

  next();

  console.log(requestAmt);
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const index = projects.findIndex(i => i.id === id);

  if (index < 0) {
    return res.status(400).json({ error: "Project id does not exist" });
  }

  req.index = index;

  return next();
}

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  if (projects.find(p => p.id === id)) {
    return res.status(500).json({ error: "Id already exists" });
  }

  const project = {
    id: id,
    title: title,
    tasks: tasks
  };

  projects.push(project);

  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.index].title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  projects.splice(req.index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.index].tasks.push(title);

  return res.json(projects);
});

server.get("/projects/:id", checkProjectExists, (req, res) => {
  return res.json(projects[req.index]);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.listen(3000);
