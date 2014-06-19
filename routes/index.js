var helpers = require("utils");

exports.index = function(db) {
  return function(req, res) {
    var collection = db.get("recipes");
    collection.find({}, function(e, docs) {
      var recipeNames = helpers.getDocNames(docs);
      res.render('index', {'title': 'cellPACK', 'recipeNames': recipeNames});
    });
  };
};

exports.modify = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    collection.find({}, function(e, docs) {
      var recipeNames = helpers.getDocNames(docs);
      var recipeData = {};
      var rnLength = recipeNames.length;
      for (var i = 0; i < rnLength; i++) {
        var individualVers = helpers.getStringVersions(docs, recipeNames[i]);
        recipeData[recipeNames[i]] = individualVers;
      }
      if (typeof req.body['recname'] != 'undefined') {
        var versArray = req.body['recversion'].split('.');
        var individualIDTree = helpers.getIdentifierTree(docs, helpers.constructIdentifier(req.body['recname'], versArray[0], versArray[1], versArray[2]));
        //console.log(individualIDTree);
        res.render('modifyt', {'title': 'Modify Recipe', 'recipeData': recipeData, 'tableTree': individualIDTree});
      } else {
        res.render('modify', {'title': 'Modify Recipe', 'recipeData': recipeData});
      }
    });
  };
};


exports.newrecipe = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    collection.find({}, function(e, docs) {
      var recipeNames = helpers.getDocNames(docs);
      res.render('newrecipe', {"recipeNames": recipeNames});
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
