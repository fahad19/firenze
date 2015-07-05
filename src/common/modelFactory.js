import _ from 'lodash';
import Model from '../Model';

module.exports = function () {
  return function (extend) {
    class GeneratedModel extends Model {
      constructor(attributes = {}, _extend = {}) {
        super(attributes, extend);
        _.merge(this, _extend);
      }
    }

    return GeneratedModel;
  };
};
