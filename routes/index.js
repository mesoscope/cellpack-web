var helpers = require("utils");

exports.index = function(db) {
  return function(req, res) {
    var collection = db.get("recipes");
    collection.find({}, function(e, docs) {
      console.log(docs)
      var recipeNames = helpers.getDocNames(docs);
      res.render("index", {"recipeNames": recipeNames});
    });
  };
};

exports.modify = function(db) {
  return function(req, res) {
    var collection = db.get("recipes");
    collection.find({}, function(e, docs) {
      res.render("modify", {"recipes": docs});
    });
  };
};

exports.modifyrn = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');

    var rn = req.params.recipename;
    var vers = req.params.version;

    var getNameTree = function(n) {
    };

    collection.find({}, function(e, docs) {
      var docsLength = docs.length;
      for (var i = 0; i < docsLength; i++) {
        if (docs[i]["name"] == tableNames[0] && docs[i]["version"] == vers) {
          var tableNames = getNameTree(rn);
        }
      }

      //console.log(docs)
      res.render("modifyrn", {"recipes": docs, "tableNames": tableNames});
    });
  };
};


exports.newrecipe = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    collection.find({}, function(e, docs) {
      res.render('newrecipe', {title: "Create New Recipe", "recipes": docs});
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
