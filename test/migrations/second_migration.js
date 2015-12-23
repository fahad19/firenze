/* eslint-disable no-unused-vars, no-undef */
import lib from '../../';

const {Promise} = lib;

export const before = function (db, direction) {
  return new Promise.resolve(true);
};

export const up = function (db) {
  return new Promise.resolve(true);
};

export const down = function (db) {
  return new Promise.resolve(true);
};

export const after = function (db, direction) {
  return new Promise.resolve(true);
};
