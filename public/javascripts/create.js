var TreeView = Backbone.View.extend({
    el: 'recipetree',
    initialize: function() {
	this.render();
    },
    render: function() {
	this.$el.html("Hello World!");
    }
});

var treeView = new TreeView();

