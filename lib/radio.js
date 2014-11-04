var logger = require('./logger');
var input = require('./input');
var exec = require('child_process').exec;

logger.info('radio started');

var player = exec('mpg321 music/"01 - Cantaloupe Island.mp3"');

input.on('channel0', function(value){
  var volume = 400 - (10600 * value);
  logger.debug('volume -> ' + volume);
  exec('amixer cset numid=1 -- '+ volume);
});
