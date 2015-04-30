var should = require('should');
var lib = require('../../index');

describe('lib', function () {
  it('should have properties', function () {
    lib.should.have.property('Database');
    lib.should.have.property('Collection');
    lib.should.have.property('Model');
  });
});
