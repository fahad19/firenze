/* eslint-disable new-cap */
import async from 'async';

import f from '../../';
import Schema from './Schema';
import Transaction from './Transaction';

let Adapter = f.Adapter;
let P = f.Promise;

export default function makeAdapter(makeConnection, extendOptions = {}) {
  class SqlAdapter extends Adapter {
    constructor(givenOptions) {
      const options = {
        schemaClass: Schema,
        transactionClass: Transaction,
        ...extendOptions,
        ...givenOptions
      };

      super(options);

      this.connection = makeConnection(options);
    }

    transaction(func) {
      return new P((resolve, reject) => {
        this.getConnection()
          .transaction((t) => {
            const instance = new this.transactionClass(t);
            const items = func.apply(this, [instance]);

            async.mapSeries(items, function (item, callback) {
              item
                .then(function (result) {
                  callback(null, result);
                })
                .catch(function (error) {
                  callback(error);
                });
            }, function (error, results) {
              if (error) {
                return instance.rollback()
                  .then(function () {
                    reject(error);
                  })
                  .catch(function (err) {
                    reject(err);
                  });
              }

              return instance.commit()
                .then(function () {
                  resolve(results);
                })
                .catch(function (err) {
                  reject(err);
                });
            });
          });
      });
    }

    getConnection() {
      return this.connection;
    }

    closeConnection() {
      return new P((resolve) => {
        this.getConnection().destroy(resolve);
      });
    }
  }

  return SqlAdapter;
}
