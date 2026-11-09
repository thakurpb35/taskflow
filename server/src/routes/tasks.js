const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth); // every task route is protected

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Reject malformed ids before hitting the DB
router.param("id", (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid task id" });
  next();
});

// GET /api/tasks?status=&priority=&search=&sort=
router.get("/", async (req, res, next) => {
  try {
    const { status, priority, search, sort } = req.query;
    const filter = { user: req.userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ title: rx }, { description: rx }];
    }
    const sortMap = {
      due: { dueDate: 1 },
      priority: { priority: 1 },
      newest: { createdAt: -1 },
    };
    const tasks = await Task.find(filter).sort(sortMap[sort] || sortMap.newest);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/stats
router.get("/stats", async (req, res, next) => {
  try {
    const rows = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const stats = { todo: 0, "in-progress": 0, done: 0 };
    rows.forEach((r) => (stats[r._id] = r.count));
    stats.total = stats.todo + stats["in-progress"] + stats.done;
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks
router.post("/", async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: "Title is required" });
    const task = await Task.create({
      user: req.userId,
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
    });
    res.status(201).json(task);
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
    next(err);
  }
});

// PUT /api/tasks/:id
router.put("/:id", async (req, res, next) => {
  try {
    const allowed = ["title", "description", "priority", "status", "dueDate"];
    const update = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) update[k] = req.body[k] === "" && k === "dueDate" ? null : req.body[k];
    });
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, update, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
    next(err);
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
