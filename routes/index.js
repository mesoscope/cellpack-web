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




	    while (flattened.length > 0) {
	        for (var r = (flattened.length - 1); r >= 0; r--) {
                // _id is generated by client
                // this recipe is not currently in database
		        if (flattened[r]["_id"].length < 4) {
                    // no children
		            if (flattened[r]["children"].length < 1) {
			            var baseRec = flattened.splice(r, 1)[0];
                        var cid = baseRec["_id"];
                        delete baseRec["_id"];
                        // must check for name conflicts
                        // before add
                        models.RecipeModel.find({"name": baseRec["name"], "current": true}, function(err, rec) {
                            if (rec) {
                                console.log(rec);
                                baseRec["version"] = rec["version"] + 1;
                                baseRec["current"] = true;
                                var newRec = new models.RecipeModel(baseRec);
                                newRec.save(function(err) {
                                    console.log(err);
                                });
                                for (var w = 0; w < flattened.length; w++) {
                                    var pidIndex = flattened[w]["children"].indexOf(cid);
                                    if (pidIndex > -1) {
                                        flattened[w]["children"][pidIndex] = newRec._id;
                                    }
                                }
                                models.RecipeModel.update({"_id": rec["_id"]}, {"current":false});
                            } else {
                                var newRec = new models.RecipeModel(baseRec);
                                newRec.save(function(err) {
                                    console.log(err);
                                });
                                for (var w = 0; w < flattened.length; w++) {
                                    var pidIndex = flattened[w]["children"].indexOf(cid);
                                    if (pidIndex > -1) {
                                        flattened[w]["children"][pidIndex] = newRec._id;
                                    }
                                }
                            }
                        });
                    }
                    // children present
                    /*
                    } else {
                        // are they all present in DB?
                        var childrenInDB = true;
                        for (var k = 0; k < flattened[r]["children"]; k++) {
                            // child id generated by client
                            if (flattened[r]["children"][k].length < 4)
                                childrenInDB = false;
                        }
                        if (childrenInDB) {
                            // all children are in db
                            var baseRec = flattened.splice(r, 1)[0];
                            var cid = baseRec["_id"];
                            delete baseRec["_id"];
                            // query db for same name
                            console.log(baseRec);
                        }
                    }
                } 
                else {
                    // _id generated by database
                    if (flattened[r]["children"].length < 1) {

                    }
                }
                */
            }
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
