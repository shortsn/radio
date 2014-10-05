var logger = require('./logger');
var config = require('config');
var component = config.components.input;

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
  var _aus = true;

  var _channels = [0,0,0,0,0];
  var buttons = [];

  function newButton(gpio, edge) {
    var button = new Gpio(gpio, 'in', edge);
    buttons.push(button);

    button.watch(function(err, value) {
      if (err) {
        logger.error(err);
        return;
      }
      _self.emit('input', 'button' + gpio, value);
    });
  }

  function read(spi, channel) {
    var txbuf = new Buffer([1, 8 + channel << 4, 0]);
    var rxbuf = new Buffer([0,0,0]);
    spi.transfer(txbuf, rxbuf, function(device, buf) {
      var result = Math.round((((buf[1] & 3) << 8) + buf[2]) / 10.23);
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
        if (!err) return;
        logger.error(err);
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
    logger.debug('input'+ name + ' : ' + value);
  });
}

util.inherits(Input, EventEmitter);
module.exports = new Input();