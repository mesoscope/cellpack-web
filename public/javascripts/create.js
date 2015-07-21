$(document).ready(function() {

    var CreateRecipe = new Marionette.Application();

    // MODEL STARTS HERE 
    // RECIPE
    CreateRecipe.Recipe = Backbone.Model.extend({
        // define url for REST operations??
        idAttribute: "_id",
        initialize: function() {
            var children = this.get("children");
            if (!children) {
                var emptyChildren = new CreateRecipe.RecipeChildren([]);
                this.set("children", emptyChildren);
            } else {
                var realChildren = new CreateRecipe.RecipeChildren(children);
                this.set("children", realChildren);
            }
        },
        defaults: {
            name: "New Recipe",
            version: 0,
            current: true,
            option: "testValue"
        },

        toJSON: function() {
            var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
            json.cid = this.cid;
            return json;
        },
        
        findModelbyCID: function(clientid) {
            // why the hell does this work?
            if (this.cid == clientid) {
                return this;
            }
        }
    });

    // RECIPE CHILDREN
    CreateRecipe.RecipeChildren = Backbone.Collection.extend({
	    model: CreateRecipe.Recipe
    });

    // FLAT RECIPES
    CreateRecipe.Recipes = Backbone.Collection.extend({
        model: CreateRecipe.Recipe
    });
    // MODEL ENDS HERE







    // VIEWS START HERE
    // TREE VIEW
    CreateRecipe.TreeView = Marionette.CollectionView.extend({
        template: "#recipeTemplate",
        tagName: "ul",
        initialize: function() {
            this.collection = this.model.get("children");
        },
        events: {
            "click .nameButton": "changeSelected"
        },
        changeSelected: function(e) {
            e.stopPropagation();

            $("button").filter(function() {
                return $(this).css("background-color") == "rgb(255, 255, 0)"
            }).css("background-color", "white");

            $(e.currentTarget).css("background-color", "yellow");
            
            var newFocusRecipe = this.model.findModelbyCID($(e.currentTarget).attr("data-id"));
            var focusTop = CreateRecipe.regions.focus.currentView.getOption("topRec");
            var newView = new CreateRecipe.FocusView({model: newFocusRecipe, topRec: focusTop});
            CreateRecipe.regions.focus.show(newView);
        },
        modelEvents: {
            "change": "render"
        }
    });

    // TREE CONTROL VIEW
    CreateRecipe.TreeControlView = Marionette.CollectionView.extend({
        template: "",
        events: {
            "click #committer": "sendRecipe"
        },
        sendRecipe: function() {
            var jsonModel = JSON.stringify(this.model.toJSON());
            if (jsonModel.indexOf("New Recipe") > -1) {
                alert("Please Name All Recipes Before Saving");
            } else {
                $.post("/recipe/"+this.model.get("name")+"/"+this.model.get("version"), {recipe: jsonModel}, function(d) {
                    if (confirm("Create Another New Recipe?\n (Cancel to Return Home)")) {
                        window.location.replace("/create");
                    } else {
                        window.location.replace("/");
                    }
                });
            }
        }
    });

    // FOCUS VIEW
    CreateRecipe.FocusView = Marionette.ItemView.extend({
        initialize: function(options) {
            // store reference to top level
            this.topRec = options.topRec;
        },
        template: "#focusTemplate",
        events: {
            "click #child": "addChild",
            "click #delete": "deleteRec",
            "click #save": "saveRec",
            "change #nameSelect": "recVersion",
            "click #existChild": "existChild"
        },
        onShow: function() {
            var nameArray = recNames.split(",");
            var options = "";
            $.each(nameArray, function(nameIndex, name) {
                options = options + "<option "+"value=\""+name+"\">"+name+"</option>";
            });
            $("#nameSelect").empty().append(options);
            this.recVersion();
        },
        addChild: function() {
            var newRecipe = new CreateRecipe.Recipe();
            this.model.get("children").add(newRecipe);
            $("button").filter(function() {
                return $(this).css("background-color") == "rgb(255, 255, 0)";
            }).css("background-color", "white");
            $("button[data-id=\""+newRecipe.cid+"\"]").css("background-color", "yellow");
            var newView = new CreateRecipe.FocusView({model: newRecipe, topRec: this.topRec});
            CreateRecipe.regions.focus.show(newView);
            this.recVersion();
        },
        deleteRec: function() {
            this.model.unset("_id");
            this.model.destroy();
            $("button[data-id=\""+this.topRec.cid+"\"]").css("background-color", "yellow");
            var newView = new CreateRecipe.FocusView({model: this.topRec, topRec: this.topRec});
            CreateRecipe.regions.focus.show(newView);
            this.recVersion();
        },
        saveRec: function() {
            var newName = $("#rec-name").val();
            if (newName)
                this.model.set("name", newName);
            var newOption = $("#rec-option").val();
            if (newOption)
                this.model.set("option", newOption);
            $("button[data-id=\""+this.model.cid+"\"]").css("background-color", "yellow");
        },
        recVersion: function() {
            // move this to separate jquery file
            $.get("/recipe/"+$("#nameSelect").val(), function(versions) {
                $("#recVersion").empty().append(function() {
                    var options = "";
                    $.each(versions, function(versionIndex, version) {
                        options += "<option "+"value=\""+version+"\">"+version+"</option>";
                    });
                    return options;
                });
            });
        },
        existChild: function() {
            var view = this;
            $.get("/recipe/"+$("#nameSelect").val()+"/"+$("#recVersion").val(), function(data) {
                console.log("Returned", data);
                var testModel = new CreateRecipe.Recipe(data);
                view.model.get("children").add(testModel);
            });
        }
    });


    // FOCUS CONTROL VIEW
    CreateRecipe.FocusControlView = Marionette.CollectionView.extend({
        template: "",
    });
    // VIEWS END HERE 
    








    // SETUP
    CreateRecipe.on("before:start", function() {
        var RecipeContainer = Marionette.LayoutView.extend({
            el: "#createContainer",
            regions: {
                tree: "#treeContainer",
                treeControl: "#treeControl",
                focus: "#focusContainer",
                focusControl: "#focusControl"
            }
        });
        CreateRecipe.regions = new RecipeContainer();
    });

    
    // INITIALIZATION
    CreateRecipe.on("start", function() {
        var initialRecipe = new CreateRecipe.Recipe();
        var initialRecipe2 = new CreateRecipe.Recipe();
        var initialRecipe3 = new CreateRecipe.Recipe();

        var tv = new CreateRecipe.TreeView({model: initialRecipe});
        var tcv = new CreateRecipe.TreeControlView({model: initialRecipe});
        CreateRecipe.regions.tree.show(tv);
        CreateRecipe.regions.treeControl.show(tcv);

        var focusSelector = "button:contains('"+initialRecipe.get("name")+"')";
        $(focusSelector).css("background-color", "yellow");

        // this doesn't need access to topRec
        var fv = new CreateRecipe.FocusView({model: initialRecipe, topRec: initialRecipe});

        // needs access to topRec only??
        var fcv = new CreateRecipe.FocusControlView({});
        CreateRecipe.regions.focus.show(fv);
        CreateRecipe.regions.focusControl.show(fcv);
    });

    CreateRecipe.start();
});
