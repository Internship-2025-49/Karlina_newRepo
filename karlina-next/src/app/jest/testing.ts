const express = require("express");
const app = express();
app.use(express.json());

let users = []; // Data dummy

// Create (POST)
app.post("/users", (req, res) => {
  const user = { id: users.length + 1, ...req.body };
  users.push(user);
  res.status(201).json(user);
});

// Get (GET)
app.get("/users", (req, res) => {
  res.json(users);
});

// Delete (DELETE)
app.delete("/users/:id", (req, res) => {
  users = users.filter((user) => user.id !== parseInt(req.params.id));
  res.status(204).send();
});

module.exports = app; // Untuk pengujian
