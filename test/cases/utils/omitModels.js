/* global describe, it */
/* eslint-disable no-invalid-this */
import should from 'should'; // eslint-disable-line

import omitModels from '../../../lib/utils/omitModels';

describe('Utils: omitModels', function () {
  it('should omit direct models', function () {
    const row = {
      id: 1,
      author: {
        attributes: {},
        get: function () { }
      },
      body: 'blah'
    };

    omitModels(row).should.eql({
      id: 1,
      body: 'blah'
    });
  });

  it('should omit models as arrays', function () {
    const row = {
      id: 1,
      posts: [
        {
          attributes: {},
          get: function () { }
        }
      ],
      body: 'blah'
    };

    omitModels(row).should.eql({
      id: 1,
      body: 'blah'
    });
  });

  it('should leave plain objects untouched', function () {
    const row = {
      id: 1,
      posts: [
        {
          attributes: {},
          hello: {}
        }
      ],
      body: 'blah'
    };

    omitModels(row).should.eql(row);
  });
});
