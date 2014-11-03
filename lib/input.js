var logger = require('./logger');
var config = require('config');
var component = config.components.input;
var exec = require('child_process').exec;

if (!component.enabled){
  return;
}

var GPIO = require('onoff').Gpio;
var SPI = require('spi');
var async = require('async');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Input(){
  var _self = this;
  var _open = true;

  var _channels = [0];
  var _buttons = [];

  newButton(18, 'both');
  newButton(23, 'both');
  newButton(24, 'both');
  newButton(25, 'both');
  newButton(12, 'both');
  newButton(16, 'both');

  function newButton(gpio, edge) {
    exec('gpio-admin export '+ gpio, function(){
      var button = new GPIO(gpio, 'in', edge);
      _buttons.push(button);

      button.watch(function(err, value) {
        _self.emit('input', 'button' + gpio, value === 0);
      });
    });
  }

  function read(spi, channel) {
    var requests = [0,0,0,0];

    async.map(requests, function(item, callback) {
      var txbuf = new Buffer([1, 8 + channel << 4, 0]);
      var rxbuf = new Buffer([0,0,0]);
      spi.transfer(txbuf, txbuf, function(device, buf) {
        var result = (((buf[1] & 3) << 8) + buf[2]);
        callback(null, result);
      });
    },
    function(err, results) {
      if (err) throw err;
      var result = 0;
      results.forEach(function(item) { result += item; });
      result = Math.round(result / results.length / 1.023) / 1000;
      if (_channels[channel] === result) return;
      _channels[channel] = result;
      _self.emit('input', 'channel' + channel, result);
    });
  }

  var _spi = new SPI.Spi('/dev/spidev0.0', { }, function(spi){
    spi.open();
    _open = true;
    logger.debug('spi open');
    async.until(
      function () {
        return !_open;
      },
      function(next) {
        for (ch = 0; ch < _channels.length; ch++) {
          read(spi, ch);
        }
        setTimeout(function(){
          next();
        }, 500);
      },
      function(err) {
        if (err) throw err;
      }
    );
  });

  function cleanup() {
    if (!_open) return;
    _open = false;
    _spi.close();
    logger.debug("spi closed");
    _buttons.forEach(function(button) {
      button.unexport();
    });
    logger.debug("gpio's unexported");
  }

  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  _self.on('input', function(name, value) {
    logger.debug('input -> '+ name + ' : ' + value);
    _self.emit(name, value);
  });
}

util.inherits(Input, EventEmitter);
module.exports = new Input();
