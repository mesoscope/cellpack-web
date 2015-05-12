var mongoose = require('mongoose');

var recipeSchema = mongoose.Schema({
    identifier: String, 
    children: []
}, {collection: 'recipes'});

exports.recipeModel = mongoose.model('Recipe', recipeSchema);