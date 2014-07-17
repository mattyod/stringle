'use strict';

var fs = require('fs'),
    path = require('path'),
    log = require('col');

module.exports = function (src) {
  var map = {};

  src = path.join(process.cwd(), src);

  var itterate = function (obj) {
    return fs.readdirAsync(src)
      .map(function (file) {
        var filePath = path.join(src, file);

        return fs.statAsync(filePath)
          .then(function (stat) {
            if (stat.isDirectory()) {
              src = path.join(src, file);
              obj[file] = {};

              return itterate(obj[file]);
            } else if (file[0] !== '.') {
              obj[file] = filePath;
            }
          });
      });
  };

  return itterate(map)
    .then(function () {
      return map;
    })
    .catch(function () {
      log.error('Failed reading directory', src);
    });
};
