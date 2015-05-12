var undersc = require('underscore');

exports.getDocNames = function(docs) {
    var docNames = [];
    for (var i = 0; i < docs.length; i++) {
        var identifierName = docs[i]['recipeIdentifier'].split('-')[0];
        if (docNames.indexOf(identifierName) < 0) {
            docNames.push(identifierName);
        }
    }
    return docNames;
}

exports.getStringVersions = function(docs, rn) {
    var versions = [];
    for (var i = 0; i < docs.length; i++) {
        if (docs[i]['recipeIdentifier'].split('-')[0] == rn) {
            var identifierVersion = docs[i]['recipeIdentifier'].split('-')[1].split('_').join('.');
            versions.push(identifierVersion);
        }
    }
    return versions;
}

getChildrenList = function(docs, identifier) {
    for (var i = 0; i < docs.length; i++) {
        if (docs[i]['recipeIdentifier'] == identifier) {
            return docs[i]['recipeChildren'];
        }
    }
}

exports.getChildrenList = function(docs, identifier) {
    for (var i = 0; i < docs.length; i++) {
        if (docs[i]['recipeIdentifier'] == identifier) {
            return docs[i]['recipeChildren'];
        }
    }
}

getIdentifierList = function(docs, identifier) {
    var childList = getChildrenList(docs, identifier);
    if (childList) {
        return [identifier].concat(childList.map(function(childID) {return getIdentifierList(docs, childID);}));
    }
    return [identifier];
}

exports.getFlatHierarchy = function(docs, identifier) {
    return undersc.flatten(getIdentifierList(docs, identifier));
}

getOptionsDict = function(docs, identifier) {
    for (var i = 0; i < docs.length; i++) {
        if (identifier == docs[i]['recipeIdentifier']) {
            return docs[i]['recipeOptions'];
        }
    }
}

buildIDTree = function(docs, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) {
            buildIDTree(docs, arr[i]);
        } else {
            var idName = arr[i].split('-')[0];
            var idVersion = arr[i].split('-')[1].split('_').join('.');
            var idOptions = getOptionsDict(docs, arr[i]);
            arr[i] = {"tablename": idName, "tableversion": idVersion, "tableoptions": idOptions};
        }
    }
}

exports.getIdentifierTree = function(docs, identifier) {
    var idList = getIdentifierList(docs, identifier);
    buildIDTree(docs, idList);
    // unflatten here
    return idList;
}

buildTrain = function(docs, topLevel, candidates, pathArray) {
    if (pathArray[pathArray.length - 1] == topLevel) {
        return pathArray;
    }

    for (var i = 0; i < candidates.length; i++) {
        for (var j = 0; j < docs.length; j++) {
            if (docs[j]['recipeIdentifier'] == candidates[i] && docs[j]['recipeChildren'].indexOf(pathArray[pathArray.length-1]) > -1) {
                pathArray.push(candidates[i]);
                return buildTrain(docs, topLevel, candidates, pathArray);
            }
        }
    }
}

exports.getDescendents = function(docs, topID, terminalID) {
    var idList = undersc.flatten(getIdentifierList(docs, topID));
    var descendentTrain = buildTrain(docs, topID, idList, [terminalID]);
    return descendentTrain;
}

exports.buildTreeRecipes = function(docs, editedArray) {
    treeRecipes = [];
    for (var i = 1; i < editedArray.length; i++) {
        var newRec = {};

        newRec['recipeIdentifier'] = getLastVersion(docs, editedArray[i]);
        newRec['recipeOptions'] = getOptionsDict(docs, editedArray[i]);
        


        var oldChildren = getChildrenList(docs, editedArray[i]);
        oldChildren[oldChildren.indexOf(editedArray[i-1])] = getLastVersion(docs, editedArray[i-1]); 
        newRec['recipeChildren'] = oldChildren;
        treeRecipes.push(newRec);
    }
    return treeRecipes;
} 

getLastVersion = function(docs, recipeIDX) {
    var recName = recipeIDX.split('-')[0]
    var maj = recipeIDX.split('-')[1].split('_')[0];
    var minor = recipeIDX.split('-')[1].split('_')[1];
    var patchMax = 0;

    for (var i = 0; i < docs.length; i++) {
        if (recName == docs[i]['recipeIdentifier'].split('-')[0] && docs[i]['recipeIdentifier'].split('-')[1].split('_')[0] == maj && docs[i]['recipeIdentifier'].split('-')[1].split('_')[1] == minor && parseInt(docs[i]['recipeIdentifier'].split('-')[1].split('_')[2]) > patchMax) {
            patchMax = parseInt(docs[i]['recipeIdentifier'].split('-')[1].split('_')[2]);
        }
    }
    var nextPatch = patchMax+1;
    return recName+'-'+maj+'_'+minor+'_'+nextPatch;
}
exports.getLastVersion = getLastVersion;
