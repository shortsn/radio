var gpio = require('rpi-gpio');
var async = require('async');

function Ampel(logger) {
  this._red = false;
  this._yellow = false;
  this._green = false;
  this._logger = logger;

  function readInput() {
    gpio.read(16, function(err, value) {
        if (err){
          logger.error(err);
        }
        logger.info('The value is ' + value);
    });
  }

  async.parallel([
    function(callback) {
      gpio.setup(15, gpio.DIR_OUT, callback);
    },
    function(callback) {
      gpio.setup(16, gpio.DIR_IN, readInput);
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

    this._logger.info( this._initialized);
    this._logger.info('writing red -> '+ value);
    gpio.write(15, value, function(){
      this._red = value;
    });
  };

  Ampel.prototype.setGreen = function(value) {
    if (this._initialized === false){
      return;
    }
    this._logger.info('writing green -> '+ value);
    gpio.write(18, value, function(){
      this._green = value;
    });
  };

  Ampel.prototype.exit = function() {
    this._logger.info('closed pins, now exit');
    gpio.destroy(function() {
        return process.exit(0);
    });
  };

  module.exports = function(logger) {
    return new Ampel(logger);
  };
