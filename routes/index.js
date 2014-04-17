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
    collection.findOne({name: rn}, function(e, docs) {
      res.render('recipe', {"recipes": docs});
    });
  };
};

exports.newrecipe = function(db) {
  return function(req, res) {
    var rn = req.body.recipename;
    var collection = db.get('recipes');
    collection.insert({"name": rn}, function(err, doc) {
      if (err) {res.send("There was a problem adding your recipe to the database.");}
      else {res.redirect("/");}
    });
  };
};
