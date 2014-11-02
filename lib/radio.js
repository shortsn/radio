var logger = require('./logger');
var input = require('./input');
var loudness = require('loudness');

logger.info('radio started');

input.on('channel1', function(volume){
  loudness.setVolume(60, function (err) {
    if (err) throw err;
    logger.debug('volume: '+ volume);
  });
});
