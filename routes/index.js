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

exports.modified = function(db) {
  return function(req, res) {

    var collection = db.get('recipes');
    var submittedID = req.body['name']+'-'+req.body['version'].split('.').join('_');
    collection.find({'identifier': submittedID}, function(e, docs) {
      var different = false;
      for (var i = 0; i < req.body['optionValues'].length; i++) {
        if (!different && req.body['optionValues'][i] != docs[0]['options'][Object.keys(docs[0]['options'])[i]]) {
          different = true;
        }
      }
      

      if (different) {
	var newR = {};
        var newVersion = req.body['version'].split('.')
        newVersion[2] = parseInt(newVersion[2]) + 1
        newR['name'] = req.body['name'];
        newR['version'] = newVersion.join('.');
        newR['optionValues'] = req.body['optionValues'];
        //console.log(newR);
        res.send(newR);
      } else {
        res.send('Please change recipe before saving!');
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
