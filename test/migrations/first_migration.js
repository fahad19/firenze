/* eslint-disable no-unused-vars, no-undef */
import lib from '../../';

const {Promise} = lib;

export const up = function (schema) {
  return new P.resolve(true);
};

export const down = function (schema) {
  return new P.resolve(true);
};

export const before = function () {
  return new P.resolve(true);
};

export const after = function () {
  return new P.resolve(true);
};
