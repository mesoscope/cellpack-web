var helpers = require('utils');

exports.index = function(recipeModel) {
    return function(req, res) {
        recipeModel.find(function (e, recipes) {
            var recNames = helpers.getDocNames(recipes);
            res.render('index', {'title': 'Cellpack', 'recNames': recNames});
        });
    };
};

exports.versioner = function(recipeModel) {
    return function(req, res) {
        recipeModel.find(function(e, recipes) {
            var possibleVersions = helpers.getStringVersions(recipes, req.body['recipename']);
            res.send(possibleVersions);
        });
    };
};

exports.modify = function(recipeModel) {
    return function(req, res) {
        recipeModel.find(function(e, recipes) {
            var recNames = helpers.getDocNames(recipes);
            res.render('modify', {'title': 'Modify Recipe', 'recNames': recNames});
        });
    };
};

exports.hierarchy = function(recipeModel) {
    return function(req, res) {
        recipeModel.find({}, function(e, recipes) {
            var reqID = req.body['recipename']+'-'+req.body['recipevers'].split('.').join('_');
            var identifierTree = helpers.getIdentifierTree(recipes, reqID);
            res.send(identifierTree);
        });
    };
};

exports.tabler = function(recipeModel) {
    return function(req, res) {
        var newID = req.body['recipename']+'-'+req.body['recipevers'].split('.').join('_');
        recipeModel.findOne({'recipeIdentifier': newID}, function(e, rec) {
            res.send(rec);
        });
    };
};

exports.commit = function(recipeModel) {
    return function(req, res) { 
        var previousVers = req.body['newRecipe']['recipeIdentifier'].split('-')[1].split('_');
        previousVers[2] = parseInt(previousVers[2]) - 1;
        var previousID = req.body['newRecipe']['recipeIdentifier'].split('-')[0]+'-'+previousVers.join('_'); 

        recipeModel.find({}, function(e, recipes) {
            var newRecipes = [{'recipeIdentifier': req.body['newRecipe']['recipeIdentifier'], 'recipeOptions': req.body['newRecipe']['recipeOptions']}];
            newRecipes[0]['recipeChildren'] = helpers.getChildrenList(recipes, previousID);
            var treeEdits = helpers.getDescendents(recipes, req.body['topLevel'], previousID);
            var treeRecipes = helpers.buildTreeRecipes(recipes, treeEdits);
            newRecipes = newRecipes.concat(treeRecipes);
            for (var i = 0; i < newRecipes.length; i++) {
                var newRecipe = recipeModel(newRecipes[i]);
                newRecipe.save();
            }
        });
    };
};

exports.create = function(recipeModel) {
    return function(req, res) {
        res.render('create', {'title': 'Create New Recipe'});
    };
};

exports.createRecipe = function(recipeModel) {
    return function(req, res) {
        console.log(req.body);
        res.redirect('/');
    };
};
