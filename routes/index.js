var models = require('../models');

module.exports = function(app) {
    app.get('/', function(req, res) {
	// adjust query to get names directly
	models.recipeModel.find({'current': true}, function(err, recipes) {
	    //console.log(recipes);
	    var recNames = models.getRecipeNames(recipes);
	    res.render('index', {'title': 'Cellpack', 'recNames': recNames});
	});
    });

    // incorporate with /recipe api
    app.post('/version', function(req, res) {
	var recName = req.body['recipename'];
	// adjust query to get versions directly
	models.recipeModel.find({'name': recName}, function(err, recipes) {
	    var recVersions = models.getRecipeVersions(recipes, recName);
	    res.send(recVersions);
	})
    });

    // incorporate with /recipe api
    /*
    app.post('/download', function (req, res) {
	console.log(req.body);
	//res.attachment({ some: 'json' });
	res.redirect('/');
    });
    */

    app.post('/recipe', function(req, res) {
	var jsonRec = JSON.parse(req.body["recipe"]);
	models.handleRecipes(jsonRec);
	res.send('success');
    });

    require('./create')(app);
}
