'use strict';

var fs = require('fs'),
    path = require('path'),
    log = require('col');

module.exports = function (src) {
  var map = {};

  src = path.join(process.cwd(), src);

  var itterate = function (obj, srcPath) {
    return fs.readdirAsync(srcPath)
      .map(function (file) {
        var filePath = path.join(srcPath, file);

        return fs.statAsync(filePath)
          .then(function (stat) {
            if (stat.isDirectory()) {
              obj[file] = {};

              return itterate(obj[file], filePath);
            } else if (file[0] !== '.') {
              obj[file] = filePath;
            }
          });
      });
  };

  return itterate(map, src)
    .then(function () {
      return map;
    })
    .catch(function () {
      log.error('Failed reading directory', src);
    });
};
