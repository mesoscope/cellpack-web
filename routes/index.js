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
    //console.log(req.body)
    var rn = req.body.recipename;
    var on = req.body.optionname;
    var ov = req.body.optionvalue;
    var on2 = req.body.optionname2;
    var ov2 = req.body.optionvalue2;
    var kys = Object.keys(req.body);
    var chld = [];
    for (var k in kys) {
      if (kys.hasOwnProperty(k)) {
        if (k == 'checked') {
          chld.push(k);
        }
      }
    }
    var collection = db.get('recipes');
    collection.insert({"name": rn, "options": {on: ov, on2: ov2}, "children": chld}, function(err, doc) {
      if (err) {res.send("There was a problem adding your recipe to the database.");}
      else {res.redirect("/");}
    });
  };
};
