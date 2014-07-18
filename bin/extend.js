'use strict';

var config = require('./config'),
    fs = require('fs'),
    Promise = require('bluebird'),
    path = require('path'),
    log = require('col'),
    _ = require('underscore');

module.exports = function (json) {

  var isEntry = function (val) {
    var is = true,
        index = 0,
        attrs = ['locations', 'msgid', 'msgstr', 'comments'];

    while (is && index < attrs.length) {
      is = _.has(val, attrs[index]);
      index++;
    }

    return is;
  };

  var itterate = function (file, obj) {
    _.each(obj, function (val, key) {
      if (isEntry(val)) {
        if (file[key] && isEntry(file[key])) {
          file[key].locations = val.locations;
        } else {
          file[key] = val;
        }
      } else if (_.isObject(obj[key])) {
        file[key] = file[key] || {};

        return itterate(file[key], obj[key]);
      }
    });

    return file;
  };

  var extend = function () {
    var promises = [];

    config.locales.forEach(function (locale) {
      var filePath = path.join(process.cwd(), config.target, locale, config.name);

      promises.push(fs.readFileAsync(filePath)
        .then(function (file) {
          return JSON.parse(file);
        })
        .catch(function () {
          return {};
        })
        .then(function (file) {
          return itterate(file, json);
        })
        .then(function (file) {
          var out = JSON.stringify(file, null, config.indent);
          return fs.writeFileAsync(filePath, out)
            .then(function () {
              file._locale = locale;
              return file;
            });
        }));
    });

    return Promise.all(promises);
  };

  var checkSetLocales = function () {
    var promises = [];

    config.locales.forEach(function (locale) {
      var dir = path.join(process.cwd(), config.target, locale);

      promises.push(checkSetDir(dir));
    });

    return Promise.all(promises);
  };

  var checkSetDir = function (dir) {
    return fs.statAsync(dir)
      .catch(function () {
        return fs.mkdirAsync(dir)
          .catch(function (err) {
            log.error(err);
          });
      });
  };

  return checkSetDir(path.join(process.cwd(), config.target))
    .then(checkSetLocales)
    .then(extend);

};
