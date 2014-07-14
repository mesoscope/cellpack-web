var helpers = require('utils');

exports.index = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    collection.find({}, function(e, docs) {
      var recNames = helpers.getDocNames(docs);
      res.render('index', {'title': 'cellPACK', 'recNames': recNames});
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

exports.tabler = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    collection.find({}, function(e, docs) {
      var reqID = req.body['recipename']+'-'+req.body['recipevers'].split('.').join('_');
      var identifierTree = helpers.getIdentifierTree(docs, reqID);
      res.send(identifierTree);
    });
  };
};

exports.commit = function(db) {
  return function(req, res) {
    console.log(req.body);
    var previousVers = req.body['identifier'].split('-')[1].split('_');
    previousVers[2] = parseInt(previousVers[2]) - 1;
    var previousID = req.body['identifier'].split('-')[0]+'-'+previousVers.join('_');
    console.log(previousID);
    var collection = db.get('recipes');
    collection.find({'identifier': previousID}, function(e, docs) {
      req.body['children'] = docs[0]['children'];
      console.log(req.body);
      collection.insert(req.body, function(e, docs) {
        res.redirect('/modify');
      });
    });
  };
};
