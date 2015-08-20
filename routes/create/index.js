var models = require("../../models");

module.exports = function(app) {
    app.get("/create", function(req, res) {
        models.RecipeModel.distinct("name", function(err, names) {
	        res.render("create", {"title": "Recipe Creation", "recNames": names});
	    });
    });
}
