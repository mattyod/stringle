'use strict';

var fs = require('fs'),
    checkSetDir = require('../../bin/checkSetDir');

describe('bin/checkSetDir', function () {

  describe('when the directory already exists', function () {

    beforeEach(function () {
      sandbox.stub(fs, 'statAsync').resolves();
      sandbox.spy(fs, 'mkdirAsync');
      checkSetDir('foo');
    });

    it('does not attempt to create the directory', function () {
      fs.mkdirAsync.should.not.have.been.called;
    });

  });

  describe('when the directory does not exist', function () {

    beforeEach(function () {
      sandbox.stub(fs, 'statAsync').rejects('bar');
      sandbox.stub(fs, 'mkdirAsync').resolves();
    });

    it('creates the folder', function (done) {
      checkSetDir('foo')
        .then(function () {
          fs.mkdirAsync.should.have.been.calledWith('foo');
          done();
        })
        .catch(done);
    });

  });

});
