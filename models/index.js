// load models
Recipe = require('./recipe');

// export models and functions
exports.recipeModel = Recipe.recipeModel;
exports.getRecipeNames = Recipe.getRecipeNames;
exports.getRecipeVersions = Recipe.getRecipeVersions;