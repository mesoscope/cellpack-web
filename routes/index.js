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
