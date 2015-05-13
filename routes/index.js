var models = require('../models');

exports = function(app) {
    app.get('/', function(req, res) {
	// fix this find declaration
	var recNames = models.recipe.getRecipeNames(models.recipe.recipeModel.find());
	res.render('index', {'title': 'Cellpack', 'recNames': recNames});
    });

    app.post('/version', function(req, res) {
	models.recipe.recipe
    });
    require('./dev')(app);
}


// refactor everything down


exports.versioner = function(recipeModel) {
    return function(req, res) {
        recipeModel.find(function(e, recipes) {
            var possibleVersions = helpers.getStringVersions(recipes, req.body['recipename']);
            res.send(possibleVersions);
        });
    };
};

exports.dev = function(recipeModel) {
    return function(req, res) {
        recipeModel.find(function(e, recipes) {
            var recNames = helpers.getDocNames(recipes);
            res.render('dev', {'title': 'Modify Recipe', 'recNames': recNames});
        });
    };
};

