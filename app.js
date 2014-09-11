var _express  = require('express');
var _path = require('path');
var _cookieParser = require('cookie-parser');
var _bodyParser = require('body-parser');
var _logger = require('./infrastructure/logger')('_server.log');
var _morgan = require('morgan')('dev');

var _server = _express();

_server.use(_morgan);
_server.use(_bodyParser.json());
_server.use(_bodyParser.urlencoded({ extended: false }));
_server.use(_cookieParser());
_server.use(_express.static(_path.join(__dirname, 'public')));

_server.set('port', process.env.PORT || (80));

var _server = _server.listen(_server.get('port'), function() {
  _logger.info('server listening on port ' + _server.address().port);
});
