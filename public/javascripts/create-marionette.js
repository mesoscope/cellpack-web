$(document).ready(function() {

    var CreateRecipe = new Marionette.Application();

    CreateRecipe.Recipe = Backbone.Model.extend({
	defaults: {
	    name: "New Recipe",
	    version: 0,
	    option: 1,
	    children: [],
	    current: true
	}
	// define url for REST operations
    });

    CreateRecipe.RecipeView = Marionette.ItemView.extend({
	template: "#recipeTemplate",
	events: {
	    "click h3": "alertName"
	},
	alertName: function() {
	    alert(this.model.escape("name"));
	}
    });

    CreateRecipe.Tree = Backbone.Collection.extend({
	model: CreateRecipe.Recipe
    });

    CreateRecipe.RecipeItemView = Marionette.ItemView.extend({
	tagName: "li",
	template: "#treeComponent"
    });

    CreateRecipe.TreeView = Marionette.CollectionView.extend({
	tagname: "ul",
	childView: CreateRecipe.RecipeItemView
    });

    CreateRecipe.on("before:start", function() {
	var RecipeContainer = Marionette.LayoutView.extend({
	    el: "#interfaceContainer",
	    regions: {
		tree: "#treeContainer",
		recipe: "#recipeContainer"
	    }
	});
	CreateRecipe.regions = new RecipeContainer();
    });

    CreateRecipe.on("start", function() {
	var initialRecipe = new CreateRecipe.Recipe();
	var recipeView = new CreateRecipe.RecipeView({model: initialRecipe});
	CreateRecipe.regions.recipe.show(recipeView);
	var initialTree = new CreateRecipe.Tree([initialRecipe]);
	var treeView = new CreateRecipe.TreeView({collection: initialTree});
	CreateRecipe.regions.tree.show(treeView);
    });

    CreateRecipe.start();
})

