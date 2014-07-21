'use strict';

var extend = require('../../bin/extend'),
    path = require('path'),
    config = require('../../bin/config'),
    fs = require('fs');

// JSON as extracted from templates
var json = {
  foo: {
    bar: {
      locations: ['foo:1', 'foo:2'],
      msgid: '__(foo.bar)',
      msgstr: '',
      comments: ''
    },
    baz: {
      locations: ['foo:3', 'foo:4'],
      msgid: '__(foo.baz)',
      msgstr: '',
      comments: ''
    }
  }
};

// A translations file with translations and comments
var file = {
  foo: {
    bar: {
      locations: ['foo:1'],
      msgid: '__(foo.bar)',
      msgstr: 'foo bar',
      comments: 'Test string 1'
    },
    baz: {
      locations: ['foo:3'],
      msgid: '__(foo.baz)',
      msgstr: 'foo baz',
      comments: 'Test string 2'
    }
  }
};

// Expected result
// N.B.
// locations should be extended
// msgids should remain intact
// msgstrs should remain intact
// comments should remain intact
var expected = [
  {
    foo: {
      bar: {
        locations: ['foo:1', 'foo:2'],
        msgid: '__(foo.bar)',
        msgstr: 'foo bar',
        comments: 'Test string 1'
      },
      baz: {
        locations: ['foo:3', 'foo:4'],
        msgid: '__(foo.baz)',
        msgstr: 'foo baz',
        comments: 'Test string 2'
      }
    },
    _locale: 'foo'
  },
  {
    foo: {
      bar: {
        locations: ['foo:1', 'foo:2'],
        msgid: '__(foo.bar)',
        msgstr: 'foo bar',
        comments: 'Test string 1'
      },
      baz: {
        locations: ['foo:3', 'foo:4'],
        msgid: '__(foo.baz)',
        msgstr: 'foo baz',
        comments: 'Test string 2'
      }
    },
    _locale: 'bar'
  }
];

var target = config.target = '../mockFiles/translations';
var locales = config.locales = ['foo', 'bar'];

describe('bin/extend', sandbox(function () {

  beforeEach(function () {
    sandbox.stub(process, 'cwd').returns(__dirname);
    sandbox.stub(fs, 'mkdirAsync').resolves();
    sandbox.stub(fs, 'readFileAsync').resolves(JSON.stringify(file));
    sandbox.stub(fs, 'writeFileAsync').resolves();
  });

  it('creates a translations folder', function (done) {
    var expectedPath = path.join(__dirname, target);

    extend(json)
      .then(function () {
        fs.mkdirAsync.args[0][0].should.equal(expectedPath);
        done();
      }).catch(done);

  });

  it('creates a folder for each locale', function (done) {
    var expectedPath1 = path.join(__dirname, target, locales[0]),
        expectedPath2 = path.join(__dirname, target, locales[1]);

    extend(json)
      .then(function () {
        fs.mkdirAsync.args[1][0].should.equal(expectedPath1);
        fs.mkdirAsync.args[2][0].should.equal(expectedPath2);
        done();
      }).catch(done);
  });

  it('writes out an extended translation to each locale folder', function (done) {
    var expectedPath1 = path.join(__dirname, target, locales[0], config.name),
        expectedPath2 = path.join(__dirname, target, locales[1], config.name);

    extend(json)
      .then(function () {
        fs.writeFileAsync.args[0][0].should.equal(expectedPath1);
        (typeof fs.writeFileAsync.args[0][1] === 'string')
          .should.be.true;

        fs.writeFileAsync.args[1][0].should.equal(expectedPath2);
        (typeof fs.writeFileAsync.args[1][1] === 'string')
          .should.be.true;

        done();
      }).catch(done);
  });

  it('return the extended translations for each locale', function () {
    extend(json).should.become(expected);
  });

}));
