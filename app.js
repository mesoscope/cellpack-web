// load express
var express = require('express');
// load routes
// what does this do?
var routes = require('./routes');
// load http module
var http = require('http');
// load path
// what does this do?
var path = require('path');

// load mongoose
var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/cellpack';
mongoose.connect(mongoUri);
var recipeSchema = mongoose.Schema({
    recipeIdentifier: String,
    recipeOptions: mongoose.Schema.Types.Mixed,
    recipeChildren: []
}, {collection: 'recipes'});
var Recipe = mongoose.model('Recipe', recipeSchema);

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index(Recipe));
app.post('/versioner', routes.versioner(Recipe));

app.get('/modify', routes.modify(Recipe));
app.post('/hierarchy', routes.hierarchy(Recipe));
app.post('/tabler', routes.tabler(Recipe));
app.post('/commit', routes.commit(Recipe));

app.get('/create', routes.create(Recipe));
app.post('/create', routes.createRecipe(Recipe));

app.post('/download', routes.downloadRecipe(Recipe));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
