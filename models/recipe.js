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

// function to convert from json object to new recipe for saving
// function to extract recipe from nested recipe
function flattenRecipe(r) {
    var innerFlatten = function(rec, result) {
	var newName = rec["name"];
	var newVersion = rec["version"];
	var newOption = rec["option"];
	// this contains actual children
	var newChildren = rec["children"];
	var newCurrent = rec["current"];
	var newRec = {name: newName, version: newVersion, option: newOption, children: newChildren, current: newCurrent};
	result.push(newRec);
	if (newChildren) {
	    for (var c = 0; c < newChildren.length; c++) {
		innerFlatten(newChildren[c], result);
	    }
	}
	return result;
    }
    return innerFlatten(r, []);
}

function insertRecipes(recArray) {
    while (recArray) {
	for (var r = (recArray.length - 1); r >= 0; r--) {
	    if (!recArray[r]["children"] && notPresent(recArray[r])) {
		var newRec = new RecipeModel(recArray[r]);
		newRec.save(function(err) {
		    console.log(err);
		});
		recArray.splice(r, 1);		
	    } else if (notPresent(recArray[r])) {
		var allChildIds = allChildrenPresent(recArray[r]["children"]);
		if (allChildIds) {
		    var intermediateRec = recArray[r];
		    intermediateRec["children"] = allChildIds;
		    var newRec = new RecipeModel(intermediateRec);
		    newRec.save(function(err) {
			console.log(err);
		    });
		    recArray.splice(r, 1);
		}
	    }
	}
    }
}

function notPresent(rec) {
    var recName = rec["name"];
    var recVersion = rec["version"];
    RecipeModel.find({'name': recName, "version": recVersion}, function(err, recipes) {
	if (recipes)
	    return false;
	else
	    return true;
    });
}

function allChildrenPresent(rec) {
    var queryArray = [];
    for (var c = 0; c < rec["children"].length; c++) {
	queryArray.push({"name": rec["children"][c]["name"], "version": rec["children"][c]["version"]});
    }
    RecipeModel.find({$or: queryArray}, function(err, recipes) {
	if (recipes.length == rec["children"].length) {
	    return recipes.map(function(r) {return r._id.str});
	}
	else
	    return [];
    });
}

function handleRecipes(r) {
    insertRecipes(flattenRecipe(r));
    //return flattenRecipe(r);
}
exports.handleRecipes = handleRecipes;