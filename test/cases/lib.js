/* global describe, it, firenze */
import should from 'should'; // eslint-disable-line

describe('lib', function () {
  it('should have properties', function () {
    firenze.should.have.property('Database');
    firenze.should.have.property('Adapter');
    firenze.should.have.property('Collection');
    firenze.should.have.property('Model');
    firenze.should.have.property('Behavior');
  });
});
