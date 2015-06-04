// unnecessary for now
var models = require('../../models');

module.exports = function(app) {
    app.get('/create', function(req, res) {
	res.render('create', {'title': 'Recipe Development'});
    });
}