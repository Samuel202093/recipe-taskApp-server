import express from "express";
import {
  createRecipe,
  fetchRecipes,
  fetchRecipe,
  updateRecipe,
  removeRecipe,
} from "../controllers/recipe.js";
import recipeValidationRules from "../utils/recipeValidation.js";
import { upload } from "../utils/multer.js";

const route = express.Router();

route.post(
  "/recipes",
  upload.single("image"),
  recipeValidationRules,
  createRecipe
);
route.get("/recipes", fetchRecipes);
route.get("/recipes/:id", fetchRecipe);
route.put(
  "/recipes/:id",
  upload.single("image"),
  recipeValidationRules,
  updateRecipe
);
route.delete("/recipes/:id", removeRecipe);

export default route;
