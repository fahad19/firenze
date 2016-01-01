/* eslint-disable new-cap */
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

            func.apply(this, [instance])
              .then(resolve)
              .catch(reject);
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
