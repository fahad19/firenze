/* global describe, it */
import should from 'should'; // eslint-disable-line

import lib from '../../';

describe('lib', function () {
  it('should have properties', function () {
    lib.should.have.property('Database');
    lib.should.have.property('Adapter');
    lib.should.have.property('Collection');
    lib.should.have.property('Model');
    lib.should.have.property('Behavior');
  });
});
