import _ from 'lodash';
import Collection from '../Collection';

module.exports = function (db = null) {
  return function (extend) {
    class GeneratedCollection extends Collection {
      constructor(_extend = {}) {
        super(_extend);

        if (!this.getDatabase() && db) {
          this.setDatabase(db);
        }

        _.merge(this, extend);
      }
    }

    return GeneratedCollection;
  };
}
