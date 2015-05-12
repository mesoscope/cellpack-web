var db = require('./mongoose');

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');


// instantiates the application
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




// DROP RECIPE REFERENCES

app.get('/', routes.index(Recipe));
//app.get('/', routes.index)

//app.post('/versioner', routes.versioner(Recipe));


//app.get('/dev', routes.dev(Recipe));


//app.post('/hierarchy', routes.hierarchy(Recipe));
//app.post('/tabler', routes.tabler(Recipe));
//app.post('/save', routes.save);
//app.post('/commit', routes.commit(Recipe));

//app.post('/download', routes.downloadRecipe(Recipe));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});