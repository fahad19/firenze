import _ from 'lodash';

import P from '../../Promise';
import Schema from '../../Schema';

function createColumns(collectionSchema) {
  return function (t) {
    _.each(collectionSchema, function (column, name) {
      const args = [name];
      const lookForArgs = [
        'length',
        'textType',
        'precision',
        'scale',
        'values'
      ];

      lookForArgs.forEach(function (argName) {
        if (typeof column[argName] !== 'undefined') {
          args.push(column[argName]);
        }
      });

      const c = t[column.type](...args);

      // primary
      if (column.primary === true) {
        c.primary();
      } else if (_.isArray(column.primary)) {
        c.primary(column.primary);
      }

      // unique
      if (column.unique === true) {
        c.unique();
      }

      // nullable
      if (column.nullable === true) {
        c.nullable();
      } else if (column.nullable === false) {
        c.notNullable();
      }

      // default
      if (typeof column.default !== 'undefined') {
        c.defaultTo(column.default);
      }

      // unsigned
      if (column.unsigned === true) {
        c.unsigned();
      }

      // comment
      if (typeof column.comment !== 'undefined') {
        c.comment(column.comment);
      }
    });
  };
}

export default class SqlSchema extends Schema {
  dropTable(tableName) {
    const connection = this.getConnection();

    return new P((resolve, reject) => {
      connection.schema.dropTable(tableName)
        .then((...args) => resolve(...args))
        .catch(error => reject(error));
    });
  }

  tableExists(tableName) {
    const connection = this.getConnection();

    return new P((resolve, reject) => {
      connection.schema.hasTable(tableName)
        .then(exists => resolve(exists))
        .catch(error => reject(error));
    });
  }

  renameTable(from, to) {
    const connection = this.getConnection();

    return new P((resolve, reject) => {
      connection.schema.renameTable(from, to)
        .then((...args) => resolve(...args))
        .catch(error => reject(error));
    });
  }

  createTable(tableName, collectionSchema) {
    const connection = this.getConnection();

    return new P((resolve, reject) => {
      connection.schema.createTable(tableName, createColumns(collectionSchema))
        .then(results => resolve(results))
        .catch(error => reject(error));
    });
  }

  columnExists(tableName, columnName) {
    const connection = this.getConnection();

    return new P((resolve, reject) => {
      connection.schema.hasColumn(tableName, columnName)
        .then(exists => resolve(exists))
        .catch(error => reject(error));
    });
  }

  dropColumns(tableName, columnNames) {
    const connection = this.getConnection();

    return new P((resolve, reject) => {
      connection.schema.dropColumns(tableName, columnNames)
        .then(result => resolve(result))
        .catch(error => reject(error));
    });
  }

  createColumns(tableName, collectionSchema) {
    const connection = this.getConnection();

    return new P((resolve, reject) => {
      connection.schema.table(tableName, createColumns(collectionSchema))
        .then(results => resolve(results))
        .catch(error => reject(error));
    });
  }

  renameColumn(tableName, from, to) {
    const connection = this.getConnection();

    return new P((resolve, reject) => {
      connection.schema.table(tableName, (t) => {
        t.renameColumn(from, to);
      })
        .then(results => resolve(results))
        .catch(error => reject(error));
    });
  }

  // @TODO: alterColumn()

  createIndex(tableName, columns, indexName, indexType) {
    const connection = this.getConnection();

    return new P((resolve, reject) => {
      connection.schema.table(tableName, (t) => {
        t.index(columns, indexName, indexType);
      })
        .then(results => resolve(results))
        .catch(error => reject(error));
    });
  }

  dropIndex(tableName, columns, indexName) {
    const connection = this.getConnection();

    return new P((resolve, reject) => {
      connection.schema.table(tableName, (t) => {
        t.dropIndex(columns, indexName);
      })
        .then(results => resolve(results))
        .catch(error => reject(error));
    });
  }
}
