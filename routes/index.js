var helpers = require('utils');

exports.index = function(recipeModel) {
    return function(req, res) {
        recipeModel.find(function (e, recipes) {
            console.log(recipes);
        });
    };
};

exports.versioner = function(db) {
    return function(req, res) {
        var collection = db.get('recipes');
        collection.find({}, function(e, docs) {
            var possibleVersions = helpers.getStringVersions(docs, req.body['recipename']);
            res.send(possibleVersions);
        });
    };
};

exports.modify = function(db) {
    return function(req, res) {
        var collection = db.get('recipes');
        collection.find({}, function(e, docs) {
            var recNames = helpers.getDocNames(docs);
            res.render('modify', {'title': 'Modify Recipe', 'recNames': recNames});
        });
    };
};

// clean this up with mongoose?
exports.hierarchy = function(db) {
    return function(req, res) {
        var collection = db.get('recipes');
        collection.find({}, function(e, docs) {
            var reqID = req.body['recipename']+'-'+req.body['recipevers'].split('.').join('_');
            var identifierTree = helpers.getIdentifierTree(docs, reqID);
            res.send(identifierTree);
        });
    };
};

exports.tabler = function(db) {
    return function(req, res) {
        var newID = req.body['recipename']+'-'+req.body['recipevers'].split('.').join('_');
        var collection = db.get('recipes');
        collection.find({'identifier': newID}, function(e, docs) {
            res.send(docs[0]);
        });
    };
};

exports.commit = function(db) {
    return function(req, res) {
        
        var previousVers = req.body['newRecipe']['identifier'].split('-')[1].split('_');
        previousVers[2] = parseInt(previousVers[2]) - 1;
        var previousID = req.body['newRecipe']['identifier'].split('-')[0]+'-'+previousVers.join('_'); 

        var collection = db.get('recipes');
        collection.find({}, function(e, docs) {
            var newRecipes = [{'identifier': req.body['newRecipe']['identifier'], 'options': req.body['newRecipe']['options']}];
            newRecipes[0]['children'] = helpers.getChildrenList(docs, previousID);
            var treeEdits = helpers.getDescendents(docs, req.body['topLevel'], previousID);
            var treeRecipes = helpers.buildTreeRecipes(docs, treeEdits);
            newRecipes = newRecipes.concat(treeRecipes);
            for (var i = 0; i < newRecipes.length; i++) {
                collection.insert(newRecipes[i]);
            }
        });
    };
};
