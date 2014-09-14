var gpio = require('rpi-gpio');
var async = require('async');

function Ampel(logger) {
  this._red = false;
  this._yellow = false;
  this._green = false;
  this._logger = logger;

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
      if (err) {
        logger.error(err);
      }
      logger.info('ampel -> initialized');
    });
  }

  Ampel.prototype.setRed = function(value) {
    if (this._initialized === false){
      return;
    }

    this._logger.log( this._initialized);
    this._logger.log('writing red -> '+ value);
    gpio.write(15, value, function(){
      this._red = value;
    });
  };

  Ampel.prototype.setGreen = function(value) {
    if (this._initialized === false){
      return;
    }
    this._logger.log('writing green -> '+ value);
    gpio.write(16, value, function(){
      this._green = value;
    });
  };

  Ampel.prototype.setYellow = function(value) {
    if (this._initialized === false){
      return;
    }
    this._logger.log('writing yellow -> '+ value);
    gpio.write(18, value, function(){
      this._yellow = value;
    });
  };

  Ampel.prototype.exit = function() {
    gpio.destroy(function() {
        this._logger.log('closed pins, now exit');
        return process.exit(0);
    });
  };

  module.exports = function(logger) {
    return new Ampel(logger);
  };
