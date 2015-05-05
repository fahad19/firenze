/* global describe, it */

var should = require('should'); //eslint-disable-line
var lib = require('../../index');

describe('lib', function () {
  it('should have properties', function () {
    lib.should.have.property('Database');
    lib.should.have.property('fixtures');
  });
});
