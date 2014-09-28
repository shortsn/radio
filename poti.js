var SPI = require('spi');
var async = require('async');

function test(spi){
var channel = 0;
var txbuf=new Buffer([1, 8 + channel << 4, 0]);
var rxbuf=new Buffer([0,0,0]);

spi.transfer(txbuf, rxbuf, function(device, buf) {
    var result = ((buf[1] & 3) << 8) + buf[2];
    console.log(result);
  });
}

var spi = new SPI.Spi('/dev/spidev0.0', { } , function(s){
  s.open();
  console.log('max speed: ' + s.maxSpeed());
  console.log('open');

  async.forever(
      function(next) {
        test(s);
      setTimeout(function(){
        next();
      }, 200);

      },
      function(err) {
          console.log(err);
      }
  );
});

process.on('exit', function () {
  console.log("closing spi");
  spi.close();
  console.log("exit");
});

process.on('SIGINT', function () {
  console.log("closing spi");
  spi.close();
  console.log("SIGINT");
});

process.on('SIGTERM', function () {
  console.log("closing spi");
  spi.close();
  console.log("SIGTERM");
});
