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

exports.create = function(recipeModel) {
    return function(req, res) {
        recipeModel.find(function(e, recipes) {
            var recNames = helpers.getDocNames(recipes);
            res.render('create', {'title': 'Create New Recipe', 'recNames': recNames});
        });
    };
};

exports.createRecipe = function(recipeModel) {
    return function(req, res) {
        if (req.body['recname'] != '') {
            var newRecipe = {'recipeIdentifier': req.body['recname']+'-0_0_0'};

            if (req.body['optionLab'] != '') {
                newRecipe['recipeOptions'] = {};
                if (req.body['optionLab'] instanceof Array) {
                    for (var i = 0; i < req.body['optionLab'].length; i++) {
                        newRecipe['recipeOptions'][req.body['optionLab'][i]] = req.body['optionVal'][i];
                    }
                } else {
                    newRecipe['recipeOptions'][req.body['optionLab']] = req.body['optionVal'];
                }
            }

            if (req.body.hasOwnProperty('childname')) {
                if (req.body['childname'] instanceof Array) {
                    var childidentifiers = [];
                    for (var i = 0; i < req.body['childname'].length; i++) {
                        childidentifiers.push(req.body['childname'][i]+'-'+req.body['childversion'][i].split('.').join('_'));
                    }
                    newRecipe['recipeChildren'] = childidentifiers;
                } else {
                    newRecipe['recipeChildren'] = [req.body['childname']+'-'+req.body['childversion'].split('.').join('_')]; 
                } 
            } else { 
                newRecipe['recipeChildren'] = []; 
            } 
            var createdRecipe = new recipeModel(newRecipe);
            createdRecipe.save();
        }
        res.redirect('/');
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
