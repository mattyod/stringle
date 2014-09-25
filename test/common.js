'use strict';

var path = require('path');

var Bluebird = require('bluebird');

Bluebird.promisifyAll(require('fs'));

global.configPath = path.join(process.cwd(), 'bin/config.js');

global.sinon = require('sinon');
global.should = require('chai')
  .use(require('sinon-chai'))
  .use(require('chai-as-promised'))
  .should();

require('sinon-as-promised')(Bluebird);

(function () {
  global.sandbox = function (fn) {

    beforeEach(function () {
      global.sandbox = global.sinon.sandbox.create({
        injectInto: null,
        properties: ['spy', 'stub', 'mock']
      });
    });

    afterEach(function () {
      global.sandbox.restore();
    });

    after(function () {
      // reset the config file for every test suite
      delete require.cache[configPath];
    });

    return fn;
  };
})();
