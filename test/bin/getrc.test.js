'use strict';

var getrc = require('../../bin/getrc'),
    Promise = require('bluebird'),
    fs = require('fs');

var rc = {
  src: 'src/templates',
  target: 'src/translations'
};

var expected = {
  name: 'translations.json',
  indent: 2,
  open: '__(',
  close: ')',
  regexp: '__\\(.*?\\)',
  src: 'src/templates',
  target: 'src/translations'
};

describe('bin/getrc', sandbox(function () {

  beforeEach(function () {
    sandbox.stub(fs,'readFileAsync').returns(
      new Promise(function (resolve) {
        resolve(JSON.stringify(rc));
      }));
  });

  it('it extends the config with .rc values', function () {
    return getrc(require('../../bin/config')).should.become(expected);
  });

}));
