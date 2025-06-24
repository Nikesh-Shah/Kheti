import express from "express";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getTopSellingByCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", addCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/", getCategories);

router.get("/top-selling-by-category", getTopSellingByCategory);

export default router;