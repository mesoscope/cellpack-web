$(document).ready(function() {

    var CreateRecipe = new Marionette.Application();

    // RECIPE
    // BACKBONE MODEL
    CreateRecipe.Recipe = Backbone.Model.extend({
	// define url for REST operations

	initialize: function() {
	    var children = new CreateRecipe.RecipeChildren([]);
	    this.set("children", children);
	},

	defaults: {
	    name: "New Recipe",
	    option: 1,
	    current: true
	}
    });

    // RECIPE CHILDREN
    // BACKBONE COLLECTION
    CreateRecipe.RecipeChildren = Backbone.Collection.extend({
	model: CreateRecipe.Recipe
    });

    // RECIPE VIEW
    CreateRecipe.RecipeView = Marionette.CompositeView.extend({
	// model template
	template: "#recipeTemplate",
	childView: CreateRecipe.ChildView,
	initialize: function() {
	    this.collection = this.model.get("children");
	},
	events: {
	    "click .nameButton": "changeSelected"
	},
	changeSelected: function(e) {
	    console.log(e.currentTarget().html());
	},
	modelEvents: {
	    "change": "render"
	}
    });

    // RECIPE CHILD VIEW
    CreateRecipe.ChildView = Marionette.ItemView.extend({
	template: "#recipeTemplate",
	tagName: "ul"
    });

    // FOCUS VIEW
    CreateRecipe.FocusView = Marionette.ItemView.extend({
	template: "#focusTemplate",
	events: {
	    "click #child": "addChild",
	    "click #delete": "alertDelete",
	    "click #save": "saveRec"
	},
	addChild: function() {
	    var newRecipe = new CreateRecipe.Recipe();
	    this.model.get("children").add(newRecipe);
	},
	alertDelete: function() {
	    alert("delete clicked");
	},
	saveRec: function() {
	    var newName = $("#rec-name").val();
	    this.model.set("name", newName);
	}
    });

    // SETUP
    CreateRecipe.on("before:start", function() {
	var RecipeContainer = Marionette.LayoutView.extend({
	    el: "#interfaceContainer",
	    regions: {
		tree: "#treeContainer",
		focus: "#focusContainer"
	    }
	});
	CreateRecipe.regions = new RecipeContainer();
    });

    
    // INITIALIZATION
    CreateRecipe.on("start", function() {
	var initialRecipe = new CreateRecipe.Recipe();

	var topView = new CreateRecipe.RecipeView({model: initialRecipe});
	CreateRecipe.regions.tree.show(topView);

	// make this a pointer??
	var focusView = new CreateRecipe.FocusView({model: initialRecipe});
	CreateRecipe.regions.focus.show(focusView);
    });

    CreateRecipe.start();
})
