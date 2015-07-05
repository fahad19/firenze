import _ from 'lodash';
import Behavior from '../Behavior';

module.exports = function () {
  return function (extend) {
    class GeneratedBehavior extends Behavior {
      constructor(_extend = {}) {
        super(_extend);
        _.merge(this, extend);
      }
    }

    return GeneratedBehavior;
  };
};
