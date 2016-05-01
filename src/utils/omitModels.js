import _ from 'lodash';

function isModel(obj) {
  // @TODO: change it to instance of check later
  if (obj && typeof obj.get === 'function') {
    return true;
  }

  return false;
}

function clean(row) {
  let cleaned = {};

  Object.keys(row).forEach(function (k) {
    const v = row[k];

    if (isModel(v)) {
      return;
    }

    if (Array.isArray(v) && isModel(v[0])) {
      return;
    }

    if (!_.isPlainObject(v)) {
      cleaned[k] = v;

      return;
    }

    const cleanedValue = clean(v);

    if (!isNaN(k)) {
      if (k === '0') {
        cleaned = [];
      }

      cleaned.push(cleanedValue);

      return;
    }

    cleaned[k] = cleanedValue;
  });

  return cleaned;
}

export default function (row) {
  return clean(row);
}
