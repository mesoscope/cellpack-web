$(document).ready(function() {

    var Recipe = Backbone.Model.extend({
	defaults: {
	    name: "New Recipe",
	    version: 0,
	    children: [],
	    current: true
	}
    });

    var RecipeTree = Backbone.Collection.extend({
	model: Recipe
    });

    var RecipeView = Backbone.View.extend({
	el: "#recipeContainer",
	template: _.template("<h3> Hello <%= who %></h3>"),
	initialize: function() {
	    this.render();
	},
	render: function() {
	    this.$el.html(this.template({who: "World"}));
	}
    });

    var TreeView = Backbone.View.extend({
	el: "#treeContainer",
	initialize: function() {
	    this.render();
	},
	render: function() {
	    this.$el.html("Tree View Loaded");
	}
    });



    var initialRecipe = new Recipe();
    console.log(initialRecipe);
    var loadedRecipes = [initialRecipe];
    // determines which recipe is rendered in recipeView
    // more efficient use id??
    var selectedRecipe = initialRecipe;

    var initialTree = new RecipeTree(loadedRecipes);
    console.log(initialTree);
    var treeView = new TreeView({collection: loadedRecipes});
    var recipeView = new RecipeView({model: selectedRecipe});
})
