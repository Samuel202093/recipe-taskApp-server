import { body } from "express-validator";

const recipeValidationRules = [
  body("title")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long"),
  body("ingredients")
    .isLength({ min: 10 })
    .withMessage("Ingredients must be at least 10 characters long"),
  body("instructions")
    .isLength({ min: 15 })
    .withMessage("Instrucions must be at least 15 characters long"),
];

export default recipeValidationRules;
