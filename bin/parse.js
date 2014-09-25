'use strict';

var config = require('./config'),
    fs = require('fs'),
    _ = require('underscore'),
    Bluebird = require('bluebird'),
    log = require('col');

module.exports = function (map) {
  var object = {},
      defer = Bluebird.defer();

  var build = function (ref, location) {
    var segments = ref.replace(config.open, '')
                    .replace(config.close, '')
                    .split(/\./);

    var extend = function (obj) {
      var key = segments.shift();

      obj[key] = obj[key] || {};
      if (segments.length) {
        extend(obj[key]);
      } else {
        obj[key].locations = obj[key].locations || [];
        obj[key].msgid = obj[key].msgid || ref;
        obj[key].msgstr = obj[key].msgstr || '';
        obj[key].comments = obj[key].comments || '';

        obj[key].locations.push(location);
        obj[key].locations.sort(function (a, b) {
          a = a.split(':');
          b = b.split(':');

          return a[0].localeCompare(b[0]) || (a[1] - b[1]);
        });
      }
    };

    extend(object);
  };

  var parse = function (file, name) {
    var regexp = new RegExp(config.regexp, 'g');

    file.split('\n').forEach(function (line, number) {
      var refs = line.match(regexp) || [];
      var location = name + ':' + (number + 1);

      refs.forEach(function (ref) {
        build(ref, location);
      });

    });

  };

  var cleanMap = function (obj, key, parent, parentKey) {
    delete obj[key];

    if (_.isEmpty(obj)) {
      if (parent && typeof parent[parentKey] === 'object') {
        delete parent[parentKey];
      }
    }

    if (_.isEmpty(map)) {
      defer.resolve(object);
    }
  };

  var itterate = function (obj, parent, parentKey) {
    _.each(obj, function (val, key) {
      if (typeof val === 'string') {
        fs.readFileAsync(val, 'utf8')
          .then(function (file) {
            parse(file, key);
            cleanMap(obj, key, parent, parentKey);
          })
          .catch(function (err) {
            log.error(err);
          });
      } else {
        return itterate(obj[key], obj, key);
      }
    });
  };

  itterate(map, null, null);

  return defer.promise;
};
