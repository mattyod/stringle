'use strict';
var path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    log = require('col');

module.exports = function (config) {

  return fs.readFileAsync(path.join(process.cwd(), '.stringlerc'), 'utf8')
    .then(function (file) {
      _.extend(config, JSON.parse(file));
      return config;
    })
    .catch(function (err) {
      log.error(err);
      process.exit(1);
    });

};
