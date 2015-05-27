$(document).ready(function() {
    //Recipe = Backbone.Model.extend({});

    var RecipeView = Backbone.View.extend({
	el: "#recipeContainer",
	initialize: function() {
	    this.render();
	},
	render: function() {
	    this.$el.html("Recipe View Loaded");
	}
    });
    var recipeView = new RecipeView();

    var TreeView = Backbone.View.extend({
	el: "#treeContainer",
	initialize: function() {
	    this.render();
	},
	render: function() {
	    this.$el.html("Tree View Loaded");
	}
    });
    var treeView = new TreeView();
})
