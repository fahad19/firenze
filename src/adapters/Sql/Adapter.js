/* eslint-disable new-cap */
import _ from 'lodash';
import knex from 'knex';
import P from 'bluebird';

import f from '../../';
import Query from './Query';
import Schema from './Schema';

let Adapter = f.Adapter;

export default class SqlAdapter extends Adapter {
  constructor(options) {
    options = {
      queryClass: Query,
      schemaClass: Schema,
      ...options
    };

    super(options);

    const config = {
      client: options.client,
      connection: _.omit(options, [
        'queryClass',
        'schemaClass',
        'adapter',
        'pool'
      ]),
      pool: options.pool ? options.pool : undefined
    };
    this.knex = knex(config);
  }

  getConnection() {
    return this.knex;
  }

  closeConnection() {
    return new P((resolve) => {
      this.getConnection().destroy(resolve);
    });
  }
}
