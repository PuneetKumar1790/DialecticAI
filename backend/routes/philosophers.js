import express from "express";
import CATEGORIES from "../data/philosophers.js";

const router = express.Router();

// Get all categories with philosophers
router.get("/categories", (req, res) => {
  try {
    res.json(CATEGORIES);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get a specific category
router.get("/categories/:categoryKey", (req, res) => {
  try {
    const { categoryKey } = req.params;
    if (!CATEGORIES[categoryKey]) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(CATEGORIES[categoryKey]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// Get a specific philosopher
router.get("/philosopher/:philosopherId", (req, res) => {
  try {
    const { philosopherId } = req.params;

    for (const category of Object.values(CATEGORIES)) {
      const philosopher = category.philosophers.find(
        p => p.id === philosopherId
      );
      if (philosopher) {
        return res.json(philosopher);
      }
    }

    res.status(404).json({ error: "Philosopher not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch philosopher" });
  }
});

export default router;
