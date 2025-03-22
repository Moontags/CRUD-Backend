import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import Todo from "./Todo.js";
import cors from "cors";


const app = express();
const port = 3000;
app.use(cors());

mongoose
  .connect("mongodb://localhost/todolist", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB yhdistetty"))
  .catch((err) => console.error("MongoDB-yhteysvirhe:", err));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("ToDo Backend toimii!");
});

app.listen(port, () => {
  console.log(`Palvelin kuuntelee portissa ${port}`);
});


app.post("/todos", async (req, res) => {
  const { task } = req.body;
  try {
    const newTodo = new Todo({ task });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Tehtävää ei löydy" });
    todo.completed = req.body.completed;
    await todo.save();
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Tehtävää ei löydy" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
