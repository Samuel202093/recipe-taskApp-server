import Recipe from '../models/recipe.js'
import cloudinary from '../utils/cloudinary.js'
import {validationResult} from 'express-validator'


export const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json(validationErrors.array())
    }

    if (!req.file) {
      const newRecipe = new Recipe({
        title,
        ingredients,
        instructions,
        imageUrl: null,
      });
      const recipe = await newRecipe.save();
      res
        .status(201)
        .send({ message: "recipe created successfully", data: recipe });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)

      const newRecipe = new Recipe({
        title,
        ingredients,
        instructions,
        imageUrl: result.secure_url,
      });
      const recipe = await newRecipe.save();
      res
        .status(201)
        .send({ message: "recipe created successfully", data: recipe });
    }
  } catch (error) {
    res.status(404).send({ message: error.message});
  }
};

export const fetchRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 3;
    const recipe = await Recipe.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    if (!recipe) {
      res.status(400).send({ message: error.message || "recipes not found" });
    } else {
      res
        .status(200)
        .send({ message: "recipes gotten successfully", data: recipe });
    }
  } catch (error) {
    res.status(404).send({ message: error.message});
  }
};

export const fetchRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    if (!recipeId) {
      return res
        .status(400)
        .send({ message: error.message || "recipe id not found" });
    }
    const recipe = await Recipe.findById(recipeId);
    if (recipe) {
      return  res.status(200).send({ message: "recipe gotten successfully",  recipe });
    }
    else{
     return res.status(400).send({ message: error.message || "recipe not found" });
    }
   
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const recipeId = req.params.id;
    const validationErrors = validationResult(req);

    if (!recipeId) {
      return res
        .status(404)
        .send({ message: error.message || "recipe id not found" });
    }

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    if (!req.file) {
      const updatedRecipe = await Recipe.findOneAndUpdate(
        { _id: recipeId },
        {
          $set: {
            title,
            ingredients,
            instructions,
            imageUrl: null,
          },
        },
        { new: true }
      );
      if (updatedRecipe) {
        res.status(201).send({
          message: "Recipe updated successfully",
          data: updatedRecipe,
        });
      }
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      const updatedRecipe = await Recipe.findOneAndUpdate(
        { _id: recipeId },
        {
          $set: {
            title,
            ingredients,
            instructions,
            imageUrl: result.secure_url,
          },
        },
        { new: true }
      );
      if (updatedRecipe) {
        res.status(201).send({
          message: "Recipe updated successfully",
          data: updatedRecipe,
        });
      }
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export const removeRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
      if (!deletedRecipe) {
        return res
          .status(400)
          .send({ message: "recipe not deleted successfully" });
      }
      
        res.status(204).send({ message: "recipe deleted successfully" });
      
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export default {
  createRecipe,
  fetchRecipes,
  fetchRecipe,
  updateRecipe,
  removeRecipe
};
