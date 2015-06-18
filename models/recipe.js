var mongoose = require("mongoose");

var recipeSchema = mongoose.Schema({
    name: String,
    version: Number,
    current: Boolean,
    option: String,
    children: []
}, {collection: "recipes"});
exports.RecipeModel = mongoose.model("Recipe", recipeSchema);

function flattenRecipe(r) {
    var innerFlatten = function(rec, result) {

        var id = "";
        if (rec["_id"]) {
            id = rec["_id"];
        } else {
            id = rec["cid"];
        }

        var newName = rec["name"];
        var newVersion = rec["version"];
        var newCurrent = rec["current"];
        var newOption = rec["option"];

        var childArray = [];
        for (var d = 0; d < rec["children"].length; d++) {
            var childId = "";
            if (rec["children"][d]["_id"]) {
                childId = rec["children"][d]["_id"];
            } else {
                childId = rec["children"][d]["cid"];
            }
            childArray.push(childId);
        }

        var newRec = {name: newName, version: newVersion, option: newOption, children: childArray, _id: id, current: newCurrent};
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


function nestRecipe(ra) {
    while (ra.length > 1) {
        for (var z = (ra.length-1); z >= 0; z--) {
            if (ra[z]["children"].length < 1 || ra[z]["children"].every(function(ele, ind, arr) {return ("name" in ele);})) {
                for (var y = (ra.length-1); y >= 0; y--) {
                    for (var x = 0; x < ra[y]["children"].length; x++) {
                        if (ra[y]["children"][x].toString() == ra[z]["_id"]) {
                            var tRec = ra.splice(z, 1)[0];
                            var insertRec = {};
                            insertRec["_id"] = tRec["_id"];
                            insertRec["name"] = tRec["name"];
                            insertRec["version"] = tRec["version"];
                            insertRec["current"] = tRec["current"];
                            insertRec["option"] = tRec["option"];
                            insertRec["children"] = tRec["children"];
                            ra[y]["children"][x] = insertRec;
                        }
                    }
                }
            }
        }
    }
    var topRec = {};
    topRec["_id"] = ra[0]["_id"];
    topRec["name"] = ra[0]["name"];
    topRec["version"] = ra[0]["version"];
    topRec["option"] = ra[0]["option"];
    topRec["children"] = ra[0]["children"];
    return topRec;
}
exports.nestRecipe = nestRecipe;
