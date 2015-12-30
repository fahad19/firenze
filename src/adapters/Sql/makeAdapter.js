/* eslint-disable new-cap */
import f from '../../';
import Schema from './Schema';

let Adapter = f.Adapter;
let P = f.Promise;

export default function makeAdapter(makeConnection, extendOptions = {}) {
  class SqlAdapter extends Adapter {
    constructor(givenOptions) {
      const options = {
        schemaClass: Schema,
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
            return func.apply(this, [t])
              .then(t.commit)
              .catch(t.rollback);
          })
          .then(resolve)
          .catch(reject);
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
