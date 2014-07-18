'use strict';

var map = require('./map'),
    parse = require('./parse'),
    extend = require('./extend');

module.exports = function (config) {

  var mapping = {};

  map(config.src)
    .then(function (map) {
      mapping = JSON.parse(JSON.stringify(map));
      return parse(map);
    })
    .then(extend)
    .then(function (files) {
      console.log(mapping);
      console.log(files);
    });

};
