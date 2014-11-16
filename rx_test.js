var logger = require('./lib/logger');
var Rx = require('rx');
var exec = require('child_process').exec;

var GPIO = require('onoff').Gpio;

function observeGPIO(number, edge) {
  var last_value;

  var input_stream = Rx.Observable.create(function (observer) {
    var gpio;
    exec('gpio-admin export '+ number, function() {
      logger.debug('exported gpio '+ number);
      gpio = new GPIO(number, 'in', edge);

      gpio.read(function(err, value) {
        if (err) {
          observer.onError(err);
          return;
        }
        last_value = value;
        observer.onNext(value);

        gpio.watch(function(err, value) {
          if (err) {
            observer.onError(err);
            return;
          }
          last_value = value;
          observer.onNext(value);
        });
      });
    });
    return function () {
      if (gpio === undefined) return;
      logger.debug('unexported gpio '+ number);
      gpio.unexport();
    };
  })
  .publish()
  .refCount();

  return Rx.Observable
  .return(last_value)
  .concat(input_stream)
  .where(function(value) { return value !== undefined; });
}

var stream = observeGPIO(18, 'both');

var subscription1 = stream.subscribe(createObserver('SourceA'));

function cleanup(){
  subscription1.dispose();
}

function createObserver(tag) {
  return Rx.Observer.create(
    function (x) {
      console.log('Next: ' + tag + x);
    },
    function (err) {
      console.log('Error: ' + err);
    },
    function () {
      console.log('Completed');
    });
  }

process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
