$(document).ready(function() {

    var CreateRecipe = new Marionette.Application();

    // RECIPE
    // BACKBONE MODEL
    CreateRecipe.Recipe = Backbone.Model.extend({
        // define url for REST operations??

        initialize: function() {
            var children = this.get("children");
            if (!children) {
                var emptyChildren = new CreateRecipe.RecipeChildren([]);
                this.set("children", emptyChildren);
            }
        },

        defaults: {
            name: "New Recipe",
            version: 0,
            option: "testValue"
        },
        
        toJSON: function() {
            // gives server json access to cid 
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
    // BACKBONE COLLECTION
    CreateRecipe.RecipeChildren = Backbone.Collection.extend({
	    model: CreateRecipe.Recipe
    });

    // RECIPE VIEW
    CreateRecipe.RecipeView = Marionette.CompositeView.extend({
        // model template
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

            // remove yellow selection
            $("button").filter(function() {
                return $(this).css("background-color") == "rgb(255, 255, 0)"
            }).css("background-color", "white");

            $(e.currentTarget).css("background-color", "yellow");
            
            // create new view with model
            var newFocusRecipe = this.model.findModelbyCID($(e.currentTarget).attr("data-id"));
            var focusTop = CreateRecipe.regions.focus.currentView.getOption("topRec");
            var newView = new CreateRecipe.FocusView({model: newFocusRecipe, topRec: focusTop});
            CreateRecipe.regions.focus.show(newView);
        },
        modelEvents: {
            "change": "render"
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
        },
        deleteRec: function() {
            this.model.destroy();
            $("button[data-id=\""+this.topRec.cid+"\"]").css("background-color", "yellow");
            var newView = new CreateRecipe.FocusView({model: this.topRec, topRec: this.topRec});
            CreateRecipe.regions.focus.show(newView);
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
            $.get("/recipe/"+$("#nameSelect").val()+"/"+$("#recVersion").val(), function(data) {
                console.log(data);
                /*
                var buildTree = function(topModel, recArray) {
                    if (topModel.get("children").length > 0) {
                        for (var c = 0; c < topModel.get("children").length; c++) {
                            for (var j = 0; j < recArray.length; j++) {
                                if (topModel.get("children")[c]["id"])
                            }
                            topModel.get("children").add(
                        }
                    }
                };
                
                for (var r = 0; r < data.length; r++) {
                    if (data[r]["name"] == $("#nameSelect").val()) {
                        var topRecipe = new CreateRecipe.Recipe({"name": data[r]["name"], "version": data[r]["version"], "option": data[r]["option"], "current": data[r]["current"]});
                        data.splice(r, 1);
                        break;
                    }
                }
                console.log(topRecipe);
                */
                //buildTree(topRecipe, data);
                //this.model.get("children").add(topRecipe);
            });
        }
    });

    CreateRecipe.CommitView = Marionette.ItemView.extend({
        template: "#controlTemplate",
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

    // SETUP
    CreateRecipe.on("before:start", function() {
        var RecipeContainer = Marionette.LayoutView.extend({
            el: "#interfaceContainer",
            regions: {
                tree: "#treeContainer",
                focus: "#focusContainer",
                control: "#controlContainer"
            }
        });
        CreateRecipe.regions = new RecipeContainer();
    });

    
    // INITIALIZATION
    CreateRecipe.on("start", function() {

	var initialRecipe = new CreateRecipe.Recipe();
	var topView = new CreateRecipe.RecipeView({model: initialRecipe});
	CreateRecipe.regions.tree.show(topView);

	var focusSelector = "button:contains('"+initialRecipe.get("name")+"')";
	$(focusSelector).css("background-color", "yellow");

	var focusView = new CreateRecipe.FocusView({model: initialRecipe, topRec: initialRecipe});
	CreateRecipe.regions.focus.show(focusView);

	var commitView = new CreateRecipe.CommitView({model: initialRecipe});
	CreateRecipe.regions.control.show(commitView);
    });

    CreateRecipe.start();
});
