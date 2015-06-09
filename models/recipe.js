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
	for (var d = 0; d < rec["children"].length; d++) {
	    var childId = "";
	    if (rec["children"][d]["id"])
		childId = rec["children"][d]["id"];
	    else
		childId = rec["children"][d]["cid"];
	    childArray.push(childId);
	}

	var newCurrent = rec["current"];

	// make sure backbone models
	// loaded from server
	// set id attribute
	// and this hooks into it
	var tempId = "";
	if (rec["id"])
	    tempId = rec["id"];
	else
	    tempId = rec["cid"];
	    

	var newRec = {name: newName, version: newVersion, option: newOption, children: childArray, current: newCurrent, tid: tempId};
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
    return true;
}
exports.nestRecipe = nestRecipe;
