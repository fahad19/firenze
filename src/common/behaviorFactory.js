import _ from 'lodash';
import B from '../Behavior';

module.exports = function () {
  return function (extend = {}) {
    class Behavior extends B {
      constructor(_extend = {}) {
        super(_extend);
        _.merge(this, extend);
      }
    }

    return Behavior;
  };
};
