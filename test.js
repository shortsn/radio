var Rx = require('rx');
var input = require('./rx_test');

//var stream = input.observeGPIO(18, 'both');

var stream = input.observeSPI();

var subscription1 = stream.subscribe(createObserver('A '));
//var subscription2 = stream.subscribe(createObserver('B '));

function cleanup(){
  subscription1.dispose();
  //subscription2.dispose();
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
