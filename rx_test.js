var Rx = require('rx');
var exec = require('child_process').exec;
var GPIO = require('onoff').Gpio;

module.exports = {
  observeGPIO : function(number, edge) {
    var last_value;

    var input_stream = Rx.Observable.create(function (observer) {
      var gpio;
      exec('gpio-admin export '+ number, function() {
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
};
