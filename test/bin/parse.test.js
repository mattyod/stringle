'use strict';

var parse = require('../../bin/parse'),
    path = require('path');

var map = {
  test1: path.join(__dirname, '../mockFiles/templates/test1'),
  test2: path.join(__dirname, '../mockFiles/templates/test2'),
  testFolder: {
    test3: path.join(__dirname, '../mockFiles/templates/testFolder/test3')
  }
};

var expected = {
  test: {
    aside: {
      locations: ['test2:1'],
      msgid: '__(test.aside)',
      msgstr: '',
      comments: ''
    },
    header: {
      locations: [ 'test1:1', 'test2:1', 'test3:1' ],
      msgid: '__(test.header)',
      msgstr: '',
      comments: ''
    },
    subheader: {
      locations: [ 'test1:2', 'test2:2', 'test3:2' ],
      msgid: '__(test.subheader)',
      msgstr: '',
      comments: ''
    }
  },
  foo: {
    bar: {
      locations: [ 'test3:3' ],
      msgid: '__(foo.bar)',
      msgstr: '',
      comments: ''
    }
  }
};

describe('bin/parse', sandbox(function () {

  it('parses strings from the templates', function () {
    return parse(map).should.become(expected);
  });

}));
