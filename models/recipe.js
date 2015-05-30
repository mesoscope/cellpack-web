var mongoose = require('mongoose');

// add single option param as proof of concept
// options should be (key, value) pairs
// option: String
var recipeSchema = mongoose.Schema({
    name: String,
    version: Number,
    children: [],
    current: Boolean
}, {collection: 'recipes'});

exports.recipeModel = mongoose.model('Recipe', recipeSchema);

// convert these to functional paradigm
// use map, filter, etc.

function getRecipeNames(recipes) {
    // accepts array of recipes
    var recNames = [];
    for (var i = 0; i < recipes.length; i++) {
	recNames.push(recipes[i].name);
    }
    return recNames;
}
exports.getRecipeNames = getRecipeNames;

function getRecipeVersions(recipes, recipeName) {
    var versions = [];
    for (var i = 0; i < recipes.length; i++) {
	versions.push(recipes[i].version);
    }
    return versions;
}
exports.getRecipeVersions = getRecipeVersions;
