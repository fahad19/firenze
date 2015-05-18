import _ from 'lodash';
import Model from '../Model';

module.exports = function () {
  return function (extend) {
    class GeneratedModel extends Model {
      constructor(attributes = {}, _extend = {}) {
        super(attributes, _extend);
        _.merge(this, extend);
      }
    }

    return GeneratedModel;
  };
};
