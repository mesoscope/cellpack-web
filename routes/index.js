var helpers = require('utils');
var undersc = require('underscore');
var fs = require('fs');

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

exports.dev = function(recipeModel) {
    return function(req, res) {
        recipeModel.find(function(e, recipes) {
            var recNames = helpers.getDocNames(recipes);
            res.render('dev', {'title': 'Modify Recipe', 'recNames': recNames});
        });
    };
};

exports.hierarchy = function(recipeModel) {
    return function(req, res) {
        recipeModel.find({}, function(e, recipes) {
            var reqID = req.body['recipename']+'-'+req.body['recipevers'].split('.').join('_');
            var identifierTree = helpers.getIdentifierTree(recipes, reqID);
            req.session.recTree = identifierTree;
            console.log(req.session);
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

exports.save = function(req, res) {
    console.log(req.body);
    console.log(req.session);
    res.send('Tester Works');
}

// UNIFY COMMIT AND CREATE 
/*
exports.createRecipe = function(recipeModel) {
    return function(req, res) {
        console.log(req.body);
        if (req.body['newname'] != '') {
            var newRecipe = {'recipeIdentifier': req.body['newname']+'-0_0_0'};
            newRecipe['recipeOptions'] = {'testOption': 'defaultVal', 'testOption2': 'defaultVal'};
            newRecipe['recipeChildren'] = []; 
            recipeModel.find({}, function(e, recipes) {
            });
            var createdRecipe = new recipeModel(newRecipe);
            createdRecipe.save();
        }
        res.redirect('/');
    };
};
*/

// UNIFY COMMIT AND CREATE
exports.commit = function(recipeModel) {
    return function(req, res) {  
        recipeModel.find({}, function(e, recipes) {
            var nextVersion = helpers.getLastVersion(recipes, req.body['newRecipe']['recipeIdentifier']);
            var newRecipes = [{'recipeIdentifier': nextVersion, 'recipeOptions': req.body['newRecipe']['recipeOptions']}];
            newRecipes[0]['recipeChildren'] = helpers.getChildrenList(recipes, req.body['derivedIdentifier']);
            var treeEdits = helpers.getDescendents(recipes, req.body['topLevel'], req.body['derivedIdentifier']);
            var treeRecipes = helpers.buildTreeRecipes(recipes, treeEdits);
            newRecipes = newRecipes.concat(treeRecipes);
            recipeModel.create(newRecipes);
            res.send('Finished');
        });
    };
};



exports.downloadRecipe = function(recipeModel) {
    return function(req, res) {
        var requestID = req.body['recname']+'-'+req.body['recversion'].split('.').join('_');
        recipeModel.find({}, function(e, recipes) {
            var dList = helpers.getFlatHierarchy(recipes, requestID);
            res.download('./tmp/'+requestID+'-pack.json', requestID+'-pack.json', function(err) {
                if (err) {
                    var recipePack = {};
                    for (var i = 0; i < dList.length; i++) {
                        for (var j = 0; j < recipes.length; j++) {
                            if (dList[i] == recipes[j]['recipeIdentifier']){
                                recipePack[dList[i]] = recipes[j];
                            }
                        }
                    }
                    fs.writeFile('./tmp/'+requestID+'-pack.json', JSON.stringify(recipePack, null, 4), function(err) {
                        res.download('./tmp/'+requestID+'-pack.json', requestID+'-pack.json', function(err) {
                            if (err) {
                                console.log(err);
                                res.redirect('/');
                            }
                        });
                    });
                }
            });
        });
    };
};
