var helpers = require("utils");

exports.index = function(db) {
  return function(req, res) {
    var collection = db.get("recipes");
    collection.find({}, function(e, docs) {
      var recipeNames = helpers.getDocNames(docs);
      res.render("index", {"recipeNames": recipeNames});
    });
  };
};

exports.modify = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    collection.find({}, function(e, docs) {
      var recipeNames = helpers.getDocNames(docs);
      res.render('modify', {'recipeNames': recipeNames});
    });
  };
};

exports.modifyrouter = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    collection.find({}, function(e, docs) {
      var cv = helpers.getCurrentArrayVersion(docs, req.body['recname']);
      var newurl = '/modify/'.concat(req.body['recname'], '/', cv[0], '/', cv[1], '/', cv[2]);
      res.redirect(newurl);
    });
  };
};

exports.modifyrn = function(db) {
  return function(req, res) {

    var rn = req.params.recipename;
    var maj = req.params.major;
    var mino = req.params.minor;
    var bug = req.params.bug;

    var collection = db.get('recipes');

    // don't need to query entire database to find the correct recipes
    // fix this in the long term
    collection.find({}, function(e, docs) {
      var recipeNames = helpers.getDocNames(docs);
      
      // array of strings maybe?
      // eventually need to convert this to raw (between the 2)
      var possibleVersions = helpers.getStringVersions(docs, rn);

      var identifierTree = helpers.getIdentifierTree(docs, helpers.constructIdentifier(rn, maj, mino, bug));

      //console.log(identifierTree);

      res.render('modifyrn', {'recipeNames': recipeNames, 'possibleVersions': possibleVersions, 'identifierTree': identifierTree});
    });
  };
};

exports.modifyrnrouter = function(db) {
  return function(req, res) {
    var suppVersion = req.body.vers.split(".");
    console.log(suppVersion);
    var newurl = '/modify/'.concat(req.params['recipename'], '/', suppVersion[0], '/', suppVersion[1], '/', suppVersion[2]);
    console.log(newurl);
    res.redirect(newurl);
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
