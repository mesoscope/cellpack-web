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
	    version: 0,
	    option: 1,
	    current: true
	},
	
	toJSON: function() {
	    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
	    json.cid = this.cid;
	    return json
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
	    $("button").filter(function() {
		return $(this).css("background-color") == "rgb(255, 255, 0)";
	    }).css("background-color", "white");

	    $(e.currentTarget).css("background-color", "yellow");
	    // find the model in the tree
	    // create new view with model
	    //var newView = new CreateRecipe.FocusView();
	    //CreateRecipe.regions.focus.show(newView);
	},
	modelEvents: {
	    "change": "myRender"
	},
	myRender: function() {
	    console.log(this.collection);
	    render();
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
	// example children
	var initialRecipe = new CreateRecipe.Recipe();

	var topView = new CreateRecipe.RecipeView({model: initialRecipe});
	CreateRecipe.regions.tree.show(topView);

	var focusSelector = "button:contains('"+initialRecipe.get("name")+"')";
	$(focusSelector).css("background-color", "yellow");

	var focusView = new CreateRecipe.FocusView({model: initialRecipe});
	CreateRecipe.regions.focus.show(focusView);
    });

    CreateRecipe.start();
})
