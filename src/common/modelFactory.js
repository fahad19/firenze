import _ from 'lodash';
import M from '../Model';

module.exports = function () {
  return function (extend = {}) {
    class Model extends M {
      constructor(attributes = {}, _extend = {}) {
        super(attributes, _extend);
        _.merge(this, extend);
      }
    }

    return Model;
  };
};
