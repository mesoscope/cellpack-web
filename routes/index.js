var helpers = require('utils');

exports.index = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    collection.find({}, function(e, docs) {
      var recipeData = helpers.getRecData(docs);
      res.render('index', {'title': 'cellPACK', 'recipeData': recipeData});
    });
  };
};

exports.modify = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    collection.find({}, function(e, docs) {
      var recipeData = helpers.getRecData(docs);
      if (typeof req.body['recname'] != 'undefined') {
        var versArray = req.body['recversion'].split('.');
        var individualIDTree = helpers.getIdentifierTree(docs, helpers.constructIdentifier(req.body['recname'], versArray[0], versArray[1], versArray[2]));
        res.render('modifyt', {'title': 'Modify Recipe', 'topName': req.body['recname'], 'topVersion':req.body['recversion'], 'recipeData': recipeData, 'tableTree': individualIDTree});
      } else {
        res.render('modify', {'title': 'Modify Recipe', 'recipeData': recipeData});
      }
    });
  };
};


exports.committed = function(db) {
  return function(req, res) {
    console.log(req.body);
    res.redirect('/modify');
  };
};
