var helpers = require("utils");

exports.index = function(db) {
  return function(req, res) {
    var collection = db.get("recipes");
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
        res.render('modifyt', {'title': 'Modify Recipe', 'recipeData': recipeData, 'tableTree': individualIDTree});
      } else {
        res.render('modify', {'title': 'Modify Recipe', 'recipeData': recipeData});
      }
    });
  };
};

// make this function way more efficient
exports.modified = function(db) {
  return function(req, res) {
    //console.log(req.body);
    var collection = db.get('recipes');
    var submittedKeys = Object.keys(req.body);
    var docDict = {};
    for (var i = 0; i < submittedKeys.length; i++) {
      var splitted = submittedKeys[i].split('-');
      if (i == 0) {
        var splitVers = splitted[1].split('.');
        splitVers[2] = parseInt(splitVers[2]) + 1;
        docDict['identifier'] = splitted[0]+'-'+splitVers.join('_');
      }
      if (req.body[submittedKeys[i]] == '') {
        collection.find({'identifier': splitted[0]+'-'+splitted[1].split('.').join('_')}, function(e, docs) {
          console.log(splitted[2]);
          docDict[splitted[2]] = docs[0][splitted[2]];
        });
      } else {
        docDict[splitted[2]] = req.body[submittedKeys[i]];
      }
    }

    console.log(docDict);
    collection.insert(docDict, function(e, docs) {
      res.redirect('/modify');
    });
  };
};


exports.committed = function(db) {
  return function(req, res) {

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
