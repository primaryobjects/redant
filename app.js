
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , nest = require('./routes/nest')
  , appl = require('./routes/appl')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('jsonp callback', true);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
    app.locals.pretty = true;
});

app.get('/', routes.index);

app.get('/v1/:collection/find', nest.find);
app.get('/v1/:collection/:itemId', nest.get);
app.put('/v1/:collection/:itemId', nest.update);
app.delete('/v1/:collection/:itemId', nest.delete);
app.post('/v1/:collection', nest.insert);
app.get('/v1/appl/:value', appl.getItemId);
app.get('/v1/appl/city/:value', appl.getCity);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
