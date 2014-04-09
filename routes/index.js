
/*
 * GET home page.
 */

exports.index = function(db) {
  return function(req, res) {
    var collection = db.get('usercollection');
    collection.find({}, {}, function(e, docs) {
      res.render('index', {"userlist": docs});
    });
  };
};

exports.userlist = function(db) {
  return function(req, res) {
    var collection = db.get('usercollection');
    collection.find({}, {}, function(e, docs) {
      res.render('userlist', {"userlist": docs});
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
