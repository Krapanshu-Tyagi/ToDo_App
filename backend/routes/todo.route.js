import express from "express";
import Todo from "../models/todo.model.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

/* GET USER TODOS */
router.get("/", protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user });
    res.json(todos);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

/* CREATE TODO */
router.post("/", protect, async (req, res) => {
  try {
    const todo = await Todo.create({
      text: req.body.text,
      priority: req.body.priority,
      category: req.body.category,
      dueDate: req.body.dueDate,
      completed: req.body.completed,
      user: req.user,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: "Server Error" });
  }
});


/* UPDATE TODO */
router.patch("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (req.body.text !== undefined) todo.text = req.body.text;
    if (req.body.completed !== undefined)
      todo.completed = req.body.completed;

    const updated = await todo.save();
    res.json(updated);
  } catch {
    res.status(400).json({ message: "Server Error" });
  }
});

/* DELETE TODO */
router.delete("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json({ message: "Todo deleted" });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
