var mongoose = require('mongoose');

var recipeSchema = mongoose.Schema({
    name: String,
    version: Number,
    option: String,
    children: [],
    current: Boolean
}, {collection: 'recipes'});
var RecipeModel = mongoose.model('Recipe', recipeSchema);
exports.recipeModel = RecipeModel;


// FIX THESE
// convert these to functional paradigm
// use map, filter, etc.
function getRecipeNames(recipes) {
    // accepts array of recipes
    var recNames = [];
    for (var i = 0; i < recipes.length; i++) {
	recNames.push(recipes[i].name);
    }
    return recNames;
}
exports.getRecipeNames = getRecipeNames;

function getRecipeVersions(recipes, recipeName) {
    var versions = [];
    for (var i = 0; i < recipes.length; i++) {
	versions.push(recipes[i].version);
    }
    return versions;
}
exports.getRecipeVersions = getRecipeVersions;

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

function insertRecipes(recArray) {
    while (recArray.length > 0) {
	for (var r = (recArray.length - 1); r >= 0; r--) {
	    // not present in database
	    if (recArray[r]["tid"].length < 4) {
		if (recArray[r]["children"].length < 1) {
		    var baseRec = recArray.splice(r, 1)[0];
		    var newRec = new RecipeModel(baseRec);
		    newRec.save(function(err) {
			console.log(err);
		    });

		    // update rest of tree with id
		    for (var c = 0; c < recArray.length; c++) {
			var pidIndex = recArray[c]["children"].indexOf(baseRec["tid"]);
			if (pidIndex > -1)
			    recArray[c]["children"][pidIndex] = newRec._id;
		    }
		} 
		else {
		    var childrenInDB = true;
		    for (var k = 0; k < recArray[r]["children"]; k++) {
			if (recArray[r]["children"][k].length < 4)
			    childrenInDB = false;
		    }
		    if (childrenInDB) {
			var baseRec = recArray.splice(r, 1)[0];
			var newRec = new RecipeModel(baseRec);
			newRec.save(function(err) {
			    console.log(err);
			});
			// update rest of tree with id
			for (var w = 0; w < recArray.length; w++) {
			    var pidIndex = recArray[w]["children"].indexOf(baseRec["tid"]);
			    if (pidIndex > -1)
				recArray[w]["children"][pidIndex] = newRec._id;
			}
		    }
		}
	    }
	}
    }
}


function handleRecipes(r) {
    var flattened = flattenRecipe(r);
    //console.log(flattened);
    insertRecipes(flattened);
}
exports.handleRecipes = handleRecipes;