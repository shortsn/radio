var Rx = require('rx');



var stream = Rx.Observable.create(function (observer) {
  observer.onNext('foo');
  observer.onNext('bar');
  observer.onNext('foobar');

  return function () {
    console.log('disposed');
  };
})
.publish()
.refCount();

var source =  Rx.Observable.return('init').concat(stream);

var subscription1 = source.subscribe(createObserver('SourceA'));
var subscription2 = source.subscribe(createObserver('SourceB'));

subscription1.dispose();
subscription2.dispose();

subscription1 = source.subscribe(createObserver('SourceA'));
subscription2 = source.subscribe(createObserver('SourceB'));

subscription1.dispose();
subscription2.dispose();


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
