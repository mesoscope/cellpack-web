exports.index = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    collection.find({}, function(e, docs) {
      res.render('index', {"recipes": docs});
    });
  };
};

exports.recipe = function(db) {
  return function(req, res) {
    var collection = db.get('recipes');
    var rn = req.params.recipename;
    collection.find({name: rn}, function(e, docs) {
      var ols = [];
      for (r in docs) {
        if (docs.hasOwnProperty(r)) {
          var oks = Object.keys(docs[r]["options"]);
          for (ol in oks) {
            if (oks.hasOwnProperty(ol) && !(ols.indexOf(oks[ol]) > -1)) {
              ols.push(oks[ol]);
            }
          }
        }
      }
      console.log(docs)
      res.render('recipe', {"recipes": docs, "name": rn, "optionLabs": ols});
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

    var on = req.body["optionname"];
    var ov = req.body["optionvalue"];
    optDict[on] = ov;

    var on2 = req.body["optionname2"];
    var ov2 = req.body["optionvalue2"];
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
    docDict["name"] = req.body.recipename;
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
