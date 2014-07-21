'use strict';

var map = require('./map'),
    parse = require('./parse'),
    extend = require('./extend'),
    build = require('./build');

module.exports = function (config) {

  var mapping = {};

  map(config.src)
    .then(function (map) {
      mapping = JSON.parse(JSON.stringify(map));
      return parse(map);
    })
    .then(extend)
    .then(function (files) {
      build(mapping, files);
    });

};
