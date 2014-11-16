var Rx = require('rx');
var exec = require('child_process').exec;

var GPIO = require('onoff').Gpio;

function observeGPIO(number, edge) {
  exec('gpio-admin export '+ number, function() {
    var gpio = new GPIO(number, 'in', edge);
    var last_value;

    var input_stream = Rx.Observable.create(function (observer) {
      gpio.read(function(err, value) {
        if (err) throw err;
        last_value = value;

        gpio.watch(function(err, value) {
          last_value = value;
          observer.onNext(value);
        });
      });

      return function () {
        console.log('unexport gpio '+ number);
        gpio.unexport();
      };
    })
    .publish()
    .refCount();

    return Rx.Observable.return(last_value).concat(input_stream);
  });
}

var button = observeGPIO(18, 'both');

button.subscribe(
    function (x) {
        console.log('Next: ' + x.toString());
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });
