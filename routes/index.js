
/*
 * GET home page.
 */

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

exports.adduser = function(db) {
  return function(req, res) {
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var collection = db.get('usercollection');

    collection.insert({"username" : userName, "email" : userEmail}, 
			function (err, doc) {
				if (err) {
					res.send("There was a problem adding the information to the database.");} else {
				res.location("userlist");
				res.redirect("userlist");}
			});
		}
	}
