var async = require("async");
var models = require("../models");


module.exports = function(app) {
    app.get("/", function(req, res) {
	    models.RecipeModel.distinct("name", function(err, names) {
	        res.render("index", {"title": "Cellpack", "recNames": names});
	    });
    });


    // REST API
    // POST
    // ACCEPTS NESTED REPRESENTATION FROM CLIENT
    // CONVERTS TO FLAT REPRESENTATION
    // PUSHES FLAT REPRESENTATION TO DB
    app.post("/recipe/:recname/:recversion", function(req, res) {
	    var jsonRec = JSON.parse(req.body["recipe"]);
	    var flattened = models.flattenRecipe(jsonRec);


        var control = 3;

	    while (control > 0) {
	        for (var r = (flattened.length - 1); r >= 0; r--) {
                // drop index in order to search
                var queryCurrent = {"name": flattened[r]["name"], "version": flattened[r]["version"], "option": flattened[r]["option"], "children": flattened[r]["children"], "current": flattened[r]["current"]};
                models.RecipeModel.findOne(queryCurrent, function(rec, err) {
                    if (!rec) {
                        // recipe doesn't exist exactly in database 

                        console.log(flattened[r]);
                        var childrenInDB = true;
                        /*
                        for (var c = 0; c < flattened[r]["children"].length; c++) {
                            // does this need async
                            var queryChild = {"name": flattened[r]["children"][c]["name"], "version": flattened[r]["children"][c]["version"], "option": flattened[r]["chidren"][c]["option"], "children": flattened[r]["children"][c]["children"], "current": flattened[r]["children"][c]["current"]};
                            models.RecipeModel.findOne(queryChild, function(rec, err) {
                                if (rec) {
                                    childrenInDB = false;
                                }
                            });
                        }
                        */
                        console.log(childrenInDB);
                        /*
                        if (flattened[r]["children"].length < 1 || childrenInDB) {
                            // safe to push into db
                            var baseRec = flattened.splice(r, 1)[0];
                            var zid = baseRec["_id"];
                            delete baseRec["_id"];
                            models.RecipeModel.findOne({"name": baseRec["name"], "current": true}, function(rec, err) {
                                if (rec) {
                                    baseRec["version"] = rec["version"] + 1;
                                    baseRec["current"] = true;
                                    rec.current = false;
                                    rec.save();
                                }
                                var newRec = new models.RecipeModel(baseRec);
                                newRec.save();
                                for (var w = 0; w < flattened.length; w++) {
                                    var pidIndex = flattened[w]["children"].indexOf(zid);
                                    if (pidIndex > -1) {
                                        flattened[w]["children"][pidIndex] = newRec._id;
                                    }
                                }
                            });
                        }
                        */
                    }
                });
            }
            control--;
	    }
	    res.send("success");
    });

    // REST API
    // GET
    // PULLS FLAT REPRESENTATION FROM DB
    // CONVERTS TO NESTED REPRESENTATION
    // RETURNS NESTED REPRESENTATION TO CLIENT
    app.get("/recipe/:recname/:recversion/:download?", function(req, res) {
        models.RecipeModel.findOne({ "name": req.param("recname"), "version": req.param("recversion")}, function(err, rec) {
            var innerQuery = function(recipe, arr, finishedFunction) {
                arr.push(recipe);
                if (recipe["children"].length > 0) {
                    async.forEachOf(recipe["children"],
                                    function(childId, cidIndex, cb) {
                                        models.RecipeModel.findOne({"_id": childId}, function(err, rec) {
                                            innerQuery(rec, arr, finishedFunction);
                                            cb();
                                        });
                                    },
                                    function(err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                } else {
                    finishedFunction(arr);
                }
		    };
            var result = [];
            innerQuery(rec, result, function(finishedArray) {
                if (req.param("download")) {
                    var model = models.nestRecipe(finishedArray);
                    var modelString = JSON.stringify(model);
                    res.set({"Content-Disposition":"attachment; filename="+model["name"]+"_"+model["version"]+".json"});
                    res.send(modelString);
                } else {
                    res.send(models.nestRecipe(finishedArray));
                }
            });
	    });
    });

    // REST API
    // HELPER FUNCTION
    // RETURNS ARRAY OF RECIPE VERSIONS
    app.get("/recipe/:recname", function(req, res) {
        models.RecipeModel.find({"name": req.param("recname")}, function(err, recipes) {
            var versions = recipes.map(function(r) {return r["version"];});
            res.send(versions);
        });
    });
    require("./create")(app);
}
