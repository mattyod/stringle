'use strict';

var fs = require('fs'),
    log = require('col');

module.exports = function (dir) {
  return fs.statAsync(dir)
    .catch(function () {
      return fs.mkdirAsync(dir)
        .catch(function (err) {
          log.error(err);
        });
    });
};
