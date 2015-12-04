/* global describe, it */
import should from 'should';

import {Database} from '../../src';
import config from '../config';

describe('Database', function () {
  it('should connect and disconnect from server', function (done) {
    const db = new Database(config);
    db.close().then(done);
  });

  it('should generate Collection class', function (done) {
    const db = new Database(config);
    const Posts = require('../collections/Posts')(db);

    const posts = new Posts();
    posts.table.should.be.exactly('posts');
    db.close().then(done);
  });
});
