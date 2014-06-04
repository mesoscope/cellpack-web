
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

// Setting up Mongo, etc.
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/autopack');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index(db));

app.get('/modify', routes.modify(db));
app.post('/modify', routes.modifyrouter(db));

app.get('/modify/:recipename/:major/:minor/:bug', routes.modifyrn(db));
//app.post('/modify/:recipename/:major/:minor/:bug', routes.modifyrnrouter(db));

app.get('/newrecipe', routes.newrecipe(db));
app.post('/newrecipe', routes.createnewrecipe(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
