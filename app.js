var _express  = require('express');
var _path = require('path');
var _cookieParser = require('cookie-parser');
var _bodyParser = require('body-parser');
var _logger = require('./infrastructure/logger')('_server.log');
var _ampel = require('./infrastructure/ampel')(_logger);
var _morgan = require('morgan')('dev');

var _server = _express();

_server.use(_morgan);
_server.use(_bodyParser.json());
_server.use(_bodyParser.urlencoded({ extended: false }));
_server.use(_cookieParser());
_server.use(_express.static(_path.join(__dirname, 'public')));

_server.set('port', process.env.PORT || (8080));

_server.get('/api/red', function(req, res){
  _ampel.setRed(true);
  res.send('OK');
});

_server.get('/api/yellow', function(req, res){
  _ampel.setYellow(true);
  res.send('OK');
});

_server.get('/api/green', function(req, res){
  _ampel.setGreen(true);
  res.send('OK');
});

_server.listen(_server.get('port'), function() {
  _logger.info('server listening on port ' + this.address().port);
});
