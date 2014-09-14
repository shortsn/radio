var gpio = require('rpi-gpio');
var async = require('async');

function Ampel(logger) {
  var _logger = logger;
  var _initialized = false;

  var _red = false;
  var _yellow = false;
  var _green = false;

  async.parallel([
    function(callback) {
      gpio.setup(15, gpio.DIR_OUT, callback);
    },
    function(callback) {
      gpio.setup(16, gpio.DIR_OUT, callback);
    },
    function(callback) {
      gpio.setup(18, gpio.DIR_OUT, callback);
    },
    ], function(err, results) {
      if (err !== null) {
        _logger.error(err);
      }
      _logger.info('ampel -> initialized');
      _initialized = true;
    });
  }

  Ampel.prototype.setRed = function(value) {
    if (!this._initialized){
      return;
    }

    gpio.write(15, value, function(){
      _red = value;
    });
  };

  Ampel.prototype.setGreen = function(value) {
    if (!this._initialized){
      return;
    }

    gpio.write(16, value, function(){
      _green = value;
    });
  };

  Ampel.prototype.setYellow = function(value) {
    if (!this._initialized){
      return;
    }

    gpio.write(18, value, function(){
      _yellow = value;
    });
  };

  Ampel.prototype.exit = function() {
    gpio.destroy(function() {
        _logger.log('closed pins, now exit');
        return process.exit(0);
    });
  };

  module.exports = function(logger) {
    return new Ampel(logger);
  };
