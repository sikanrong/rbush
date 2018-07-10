var RandomSeed = require('random-seed');

var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var ID_LENGTH = 8; //218 Trillion unique ID space
var determinism = RandomSeed.create();

module.exports = function(seed) {
    var rtn = '';
    var random;
    if (seed){
        determinism.seed(seed);
        random = determinism.random;
    }else{
        random = Math.random;
    }

    for (var i = 0; i < ID_LENGTH; i++) {
        rtn += ALPHABET.charAt(Math.floor(random() * ALPHABET.length));
    }
    return rtn;
};