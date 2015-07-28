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

        var iterPost = function(iterArray) {
            async.forEachOfSeries(iterArray, function(rec, recIndex, cb) {
                if (rec) {
                    var queryCurrent = {"name": rec["name"], "version": rec["version"], "option": rec["option"], "children": rec["children"], "current": rec["current"]};
                    models.RecipeModel.findOne(queryCurrent, function(err, recMaybe) {
                        if (!recMaybe) {
                            async.every(queryCurrent["children"], function(c, cab) {
                                var inDB = true;
                                for (var w = 0; w < iterArray.length ; w++) {
                                    if (iterArray[w]["_id"] == c) {
                                        inDB = false;
                                        var queryChild = {"name": iterArray[w]["name"], "version": iterArray[w]["version"], "option": iterArray[w]["option"], "children": iterArray[w]["children"], "current": iterArray[w]["current"]};
                                        break;
                                    }
                                }
                                if (inDB) {
                                    var newId = models.oid(c.toString());
                                    var queryChild = {"_id": newId};
                                }
                                models.RecipeModel.findOne(queryChild, function(err, recChild) {
                                    if (recChild) {
                                        cab(true);
                                    } else {
                                        cab(false);
                                    }
                                });
                            }, function(result) {
                                if (result) {
                                    var baseRec = iterArray.splice(recIndex, 1)[0];
                                    var zid = baseRec["_id"];
                                    delete baseRec["_id"];
                                    models.RecipeModel.findOne({"name": baseRec["name"], "current": true}, function (err, recName) {
                                        if (recName) {
                                            baseRec["version"] = recName["version"] + 1;
                                            baseRec["current"] = true;
                                            recName.current = false;
                                            recName.save();
                                        }
                                        var newRec = new models.RecipeModel(baseRec);
                                        newRec.save();
                                        for (var a = 0; a < iterArray.length; a++) {
                                            var pidIndex = iterArray[a]["children"].indexOf(zid);
                                            if (pidIndex > -1) {
                                                iterArray[a]["children"][pidIndex] = newRec._id.toString();
                                            }
                                        }
                                        cb();
                                    });
                                } else {
                                    cb();
                                }
                            });
                        }
                    });
                } else {
                    cb();
                }
            }, function(err) {
                // called at end of async each
                if (err) {
                    console.log(err);
                } else {
                    if (iterArray.length > 0) {
                        iterPost(iterArray);
                    }
                }
            });
        };

        iterPost(flattened);
        res.send("success");
    });

    // REST API
    // GET
    // PULLS FLAT REPRESENTATION FROM DB
    // CONVERTS TO NESTED REPRESENTATION
    // RETURNS NESTED REPRESENTATION TO CLIENT
    app.get("/recipe/:recname/:recversion/:download?", function(req, res) {
        models.RecipeModel.findOne({ "name": req.param("recname"), "version": req.param("recversion")}, function(err, rec) {
            var queryTree = function(recNode) {
                result.push(recNode);
                if (recNode["children"].length > 0) {
                    models.RecipeModel.find({"_id": {$in: recNode["children"]}}, function(err, recs) {
                        for (var c = 0; c < recs.length ; c++) {
                            calls = calls + 1;
                            queryTree(recs[c]);
                            calls = calls - 1;
                        }
                    });
                } else {
                    calls = calls - 1;
                    if (calls == 0) {
                        if (req.param("download")) {
                            var model = models.nestRecipe(result);
                            var modelString = JSON.stringify(model);
                            res.set({"Content-Disposition":"attachment; filename="+model["name"]+"_"+model["version"]+".json"});
                            res.send(modelString);
                        } else {
                            console.log(models.nestRecipe(result));
                            res.send(models.nestRecipe(result));
                        }
                    }
                }
            };
            var result = [];
            var calls = 1;
            if (rec["children"].length > 0) {
                calls = 0
            }
            queryTree(rec);
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
