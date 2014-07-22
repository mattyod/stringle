'use strict';

var getrc = require('../../bin/getrc'),
    fs = require('fs');

var rc = {
  src: 'src/templates',
  translations: 'src/translations'
};

var expected = {
  name: 'translations.json',
  indent: 2,
  open: '__(',
  close: ')',
  regexp: '__\\(.*?\\)',
  src: 'src/templates',
  translations: 'src/translations'
};

describe('bin/getrc', sandbox(function () {

  beforeEach(function () {
    // Ensure we have a clean config
    delete require.cache[configPath];

    sandbox.stub(fs,'readFileAsync').resolves(JSON.stringify(rc));

  });

  it('it extends the config with .rc values', function () {
    return getrc(require('../../bin/config')).should.become(expected);
  });

}));
