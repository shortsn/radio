var logger = require('./logger');
var input = require('./input');
var exec = require('child_process').exec;

logger.info('radio started');

var player = exec('omxplayer -p "/home/pi/music/01 - Cantaloupe Island.mp3"');

input.on('button16', function(volume){
 player.stdin.write('+');
});

input.on('button12', function(volume){
 player.stdin.write('-');
});
