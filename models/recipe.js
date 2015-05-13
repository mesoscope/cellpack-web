var mongoose = require('mongoose');

// split name and version
// much more modular
var recipeSchema = mongoose.Schema({
    identifier: String,
    children: []
}, {collection: 'recipes'});

exports.recipeModel = mongoose.model('Recipe' recipeSchema);

function getRecipeName(rec) {
    return rec['identifier'].split('-')[0];
}
exports.getRecipeName = getRecipeName;

function getRecipeNames(recipes) {
    // accepts array of recipes
    var recNames = [];
    for (var i = 0; i < recipes.length; i++) {
	var recName = getRecipeName(recipes[i]);
	if (recNames.indexOf(recName) < 0) {
	    recNames.push(recName);
	}
    }
    return recNames;
}
exports.getRecipeNames = getRecipeNames;

function getPrettyVersions(recipes, recipeName) {
    var versions = [];
    for (var i = 0; i < recipes.length; i++) {
	if (recipes[i]['identifier'].split('-')[0] == recipeName) {
	    var identifierVersion = recipes[i]['identifier'].split('-')[1].split('_').join('.');
	    versions.push(identifierVersion);
	}
    }
    return versions;
}
