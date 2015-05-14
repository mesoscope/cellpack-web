var models = require('../../models');

module.exports = function(app) {
    // change this completely
    // depends entirely on create interface
    app.get('/dev', function(req, res) {
	var recNames = models.recipe.getRecipeNames(models.recipe.recipeModel.find());
	res.render('dev', {'title': 'Create Recipe'});
    });
}