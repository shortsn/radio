var Rx = require('rx');
var input = require('./rx_test');

var stream = input.observeGPIO(18, 'both');

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
