import express from "express";
import Todo from "../models/todo.model.js";
import protect from "../middleware/auth.middleware.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import client from "../config/redis.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    console.log(" GET /todos HIT");

    const cacheKey = `todos:${req.user}`;
    console.log(" Cache Key:", cacheKey);

    const cached = await client.get(cacheKey);
    console.log(" Cached value:", cached);

    if (cached) {
      console.log(" Serving from Redis");
      return res.json(JSON.parse(cached));
    }

    console.log(" Fetching from MongoDB");

    const todos = await Todo.find({ user: req.user });

    
    const decryptedTodos = todos.map(todo => ({
      ...todo._doc,
      text: decrypt(todo.text),
    }));

    console.log("Saving to Redis...");

    await client.setEx(cacheKey, 60, JSON.stringify(decryptedTodos));

    console.log("Saved in Redis");

    res.json(decryptedTodos);

  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    console.log("BODY:", req.body);

    if (!req.body.text || req.body.text.trim() === "") {
      return res.status(400).json({ message: "Text is required" });
    }

    const todo = await Todo.create({
      text: encrypt(req.body.text),
      priority: req.body.priority,
      category: req.body.category,
      dueDate: req.body.dueDate,
      completed: req.body.completed,
      user: req.user,
    });


    try {
      await client.del(`todos:${req.user}`);
    } catch (err) {
      console.log("Redis delete error:", err.message);
    }

   
    const response = {
      ...todo._doc,
      text: decrypt(todo.text),
    };

    res.status(201).json(response);

  } catch (error) {
    console.log(" CREATE ERROR:", error);
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (req.body.text !== undefined) {
      todo.text = encrypt(req.body.text);
    }

    if (req.body.completed !== undefined) {
      todo.completed = req.body.completed;
    }

    if (req.body.priority !== undefined) {
      todo.priority = req.body.priority;
    }

    if (req.body.category !== undefined) {
      todo.category = req.body.category;
    }

    if (req.body.dueDate !== undefined) {
      todo.dueDate = req.body.dueDate;
    }

    const updated = await todo.save();

    try {
      await client.del(`todos:${req.user}`);
    } catch (err) {
      console.log("Redis delete error:", err.message);
    }

    // Decrypt before response
    const response = {
      ...updated._doc,
      text: decrypt(updated.text),
    };

    res.json(response);

  } catch (err) {
    console.log(" UPDATE ERROR:", err);
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    try {
      await client.del(`todos:${req.user}`);
    } catch (err) {
      console.log("Redis delete error:", err.message);
    }

    res.json({ message: "Todo deleted" });

  } catch (err) {
    console.log(" DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;