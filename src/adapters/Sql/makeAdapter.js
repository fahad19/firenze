/* eslint-disable new-cap */
import f from '../../';
import Query from './Query';
import Schema from './Schema';

let Adapter = f.Adapter;
let P = f.Promise;

export default function makeAdapter(makeConnection) {
  class SqlAdapter extends Adapter {
    constructor(givenOptions) {
      const options = {
        queryClass: Query,
        schemaClass: Schema,
        ...givenOptions
      };

      super(options);

      this.connection = makeConnection(options);
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
