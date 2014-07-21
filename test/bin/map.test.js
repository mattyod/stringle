'use strict';

var map = require('../../bin/map'),
    path = require('path');

var expected = {
  test1: path.join(__dirname, '../mockFiles/templates/test1'),
  test2: path.join(__dirname, '../mockFiles/templates/test2'),
  testFolder: {
    test3: path.join(__dirname, '../mockFiles/templates/testFolder/test3')
  }
};

describe('bin/map', sandbox(function () {

  beforeEach(function () {
    sandbox.stub(process, 'cwd').returns(__dirname);
  });

  it('returns a mapping of the folder', function () {
    return map('../mockFiles/templates').should.become(expected);
  });

}));
