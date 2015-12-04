import _ from 'lodash';
import C from '../Collection';

module.exports = function (db = null) {
  return function (extend = {}) {
    class Collection extends C {
      constructor(_extend = {}) {
        super(extend);

        if (!this.getDatabase() && db) {
          this.setDatabase(db);
        }

        _.merge(this, _extend);
      }
    }

    return Collection;
  };
};
