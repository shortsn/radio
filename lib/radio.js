var logger = require('./logger');
var input = require('./input');
var exec = require('child_process').exec;

logger.info('radio started');

var player = exec('mpg321 /home/pi/music/"01 - Cantaloupe Island.mp3"',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});

input.on('channel0', function(value){
  var volume = Math.round(400 - (10600 * value));
  logger.debug('volume -> ' + volume);
  exec('amixer cset numid=1 -- '+ volume,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
});
