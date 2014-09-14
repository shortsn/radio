var gpio = require('rpi-gpio');
var async = require('async');

async.parallel([
    function(callback) {
        gpio.setup(15, gpio.DIR_OUT, callback);
    },
], function(err, results) {
	console.log(err);
  console.log('Pins set up');
	write();
});

function write() {
    async.series([
        function(callback) {
            delayedWrite(15, true, callback);
        },
        function(callback) {
            delayedWrite(15, false, callback);
        },
        function(callback) {
            delayedWrite(15, true, callback);
        },
        function(callback) {
            delayedWrite(15, false, callback);
        },
    ], function(err, results) {
        console.log('Writes complete, pause then unexport pins');
        setTimeout(function() {
            gpio.destroy(function() {
                console.log('Closed pins, now exit');
                return process.exit(0);
            });
        }, 500);
    });
}

function delayedWrite(pin, value, callback) {
    setTimeout(function() {
        gpio.write(pin, value, callback);
    }, 2000);
}
