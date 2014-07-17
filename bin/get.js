'use strict';

var map = require('./map'),
    parse = require('./parse');

module.exports = function (config) {

  map(config.src)
    .then(parse)
    .then(function (obj) {
      console.log('finally', obj);
    });

};
