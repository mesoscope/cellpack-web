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
        res.render('modifyt', {'title': 'Modify Recipe', 'topLevel': req.body['recname'], 'recipeData': recipeData, 'tableTree': individualIDTree});
      } else {
        res.render('modify', {'title': 'Modify Recipe', 'recipeData': recipeData});
      }
    });
  };
};

exports.modified = function(db) {
  return function(req, res) {
    console.log(req.body);
    var docDict = {};
    // first key is topLevel
    var submittedKeys = Object.keys(req.body);

    var initialSplitID = submittedKeys[1].split('-');
    var initialSplitVers = initialSplitID[1].split('.');
    initialSplitVers[2] = parseInt(initialSplitVers[2]) + 1;
    docDict['identifier'] = initialSplitID[0]+'-'+initialSplitVers.join('_');

    var collection = db.get('recipes');
    // rewrite this find to grab everything
    // then recursively walk the tree until top level recipe
    collection.find({}, function(e, docs) {
      var dbIdentifier = initialSplitID[0]+'-'+initialSplitID[1].split('.').join('_');
      var dbOptions = helpers.getOptionsDict(docs, dbIdentifier);
      var innerOptions = {};
      for (var i = 0; i < submittedKeys.length; i++) {
        var innerKey = submittedKeys[i].split('-')[2];
        if (req.body[submittedKeys[i]] == '') {
          innerOptions[innerKey] = dbOptions[innerKey];
        } else {
          innerOptions[innerKey] = req.body[submittedKeys[i]];
        }
      }

      docDict['options'] = innerOptions;
      docDict['children'] = docs[0]['children'];
      console.log(docDict);
      /*
      // only update direct ancestry
      var dbParents = helpers.getAllParents(docs, dbIdentifier);

      if (dbParents) {
      }
      // insert entire array at once?
      collection.insert(docDict, function(e, docs) {
        res.redirect('/modify');
      });
      */
    });
  };
};


exports.newrecipe = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    collection.find({}, function(e, docs) {
      var recipeNames = helpers.getDocNames(docs);
      res.render('newrecipe', {'title': 'New cellPACK Receipe', 'recipeNames': recipeNames});
    });
  };
};

exports.createnewrecipe = function(db) {
  return function(req, res) {
    //console.log(req.body);

    var optDict = {};

    var on = req.body["optionname"].trim();
    var ov = req.body["optionvalue"].trim();
    optDict[on] = ov;

    var on2 = req.body["optionname2"].trim();
    var ov2 = req.body["optionvalue2"].trim();
    optDict[on2] = ov2;


    var kys = Object.keys(req.body);
    var kysLength = kys.length;
    var chld = [];

    //console.log(optDict);

    for (var i = 0; i < kysLength; i++) {
      if (String(req.body[kys[i]]) == 'checked') {
        chld.push(kys[i]);
      }
    }
    console.log(chld);

    var docDict = {};
    docDict["name"] = req.body.recipename.trim();
    docDict["options"] = optDict;
    docDict["children"] = chld;

    //console.log(docDict);

    var collection = db.get('recipes');
    
    collection.insert(docDict, function(err, doc) {
      if (err) {res.send("There was a problem adding your recipe to the database.");}
      else {res.redirect("/");}
    });
  };
};
