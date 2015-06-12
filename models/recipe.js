var mongoose = require("mongoose");

var recipeSchema = mongoose.Schema({
    name: String,
    version: Number,
    option: String,
    children: []
}, {collection: "recipes"});
exports.RecipeModel = mongoose.model("Recipe", recipeSchema);

function flattenRecipe(r) {
    var innerFlatten = function(rec, result) {
        var newName = rec["name"];
        var newVersion = rec["version"];
        var newOption = rec["option"];

        var childArray = [];
        // build child array from child ids
        for (var d = 0; d < rec["children"].length; d++) {
            var childId = "";
            if (rec["children"][d]["id"])
                childId = rec["children"][d]["id"];
            else
                childId = rec["children"][d]["cid"];
            childArray.push(childId);
        }

        // make sure backbone models
        // loaded from server
        // set id attribute
        // and this hooks into it
        var tempId = "";
        if (rec["id"])
            tempId = rec["id"];
        else
            tempId = rec["cid"];
            

        var newRec = {name: newName, version: newVersion, option: newOption, children: childArray, tid: tempId};
        result.push(newRec);
        if (rec["children"].length > 0) {
            for (var c = 0; c < rec["children"].length; c++) {
                innerFlatten(rec["children"][c], result);
            }
        }
        return result;
    }
    return innerFlatten(r, []);
}
exports.flattenRecipe = flattenRecipe;


function nestRecipe(ra, topName, topVersion) {
    console.log("Recipe Array Before Nest\n", ra);
    console.log(topName);
    console.log(topVersion);
    var newRec = {};
    /*
    for (var r = 0; r < ra.length; r++) {
        if (ra[r]["name"] == topName && ra[r]["version"] == topVersion) {
            newRec.name = ra[r]["name"];
            newRec.version = ra[r]["version"];
            newRec.option = ra[r]["option"];
            newRec.children = ra[r]["children"];
            break;
        }
    }
    var innerNest = function(topRec, ra) {
    };
    console.log("Recipe Array After Nest\n", ra);
    */
    return newRec;
}
exports.nestRecipe = nestRecipe;
