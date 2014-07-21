'use strict';

var Promise = require('bluebird'),
    path = require('path'),
    log = require('col'),
    fs = require('fs'),
    _ = require('underscore'),
    rmrf = Promise.promisify(require('rimraf')),
    config = require('./config'),
    checkSetDir = require('./checkSetDir');

module.exports = function (map, files) {

  var parse = function (template, file) {
    var newFile = '';
    var regexp = new RegExp(config.regexp, 'g');

    template.split('\n').forEach(function (line) {
      var obj = file;
      newFile += line.replace(regexp, function (matcher) {
        matcher = matcher
          .replace(config.open, '')
          .replace(config.close, '')
          .split('.')
          .forEach(function (ref) {
            obj = obj[ref];
          });

        return obj.msgstr || obj.msgid;
      });

      newFile += '\n';

    });

    return newFile;
  };

  var itterate = function (map, file, views) {
    var promises = [];

    _.each(map, function (val, key) {
      if (typeof val === 'string') {
        promises.push(
          fs.readFileAsync(val, 'utf8')
          .then(function (template) {
            var fileName = path.basename(val);
            var dest = path.join(views, fileName);
            var newFile = parse(template, file);

            return fs.writeFileAsync(dest, newFile);
          }));
      } else {
        var newView = path.join(views, key);

        return checkSetDir(newView)
          .then(function () {
            return itterate(map[key], file, newView);
          });
      }
    });

    return Promise.all(promises);
  };

  var localise = function () {
    var promises = [],
        views = path.join(process.cwd(), config.templates);

    promises.push(rmrf(views)
      .then(function () {
        return fs.mkdirAsync(views);
      })
      .then(function () {
        return files.forEach(function (file) {
          var dest = path.join(views, file._locale);
          return fs.mkdirAsync(dest)
            .then(itterate(map, file, dest));
        });
      }));

    return Promise.all(promises);
  };

  return localise()
    .catch(log.error);
};
