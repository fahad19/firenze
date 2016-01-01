import Transaction from '../../Transaction';
import Promise from '../../Promise';

export default class SqlTransaction extends Transaction {
  commit = (...args) => {
    return new Promise((resolve, reject) => {
      this.get().commit()
        .then(function () {
          resolve(...args);
        })
        .catch(function () {
          reject(...args);
        });
    });
  }

  rollback = (...args) => {
    return new Promise((resolve, reject) => {
      this.get().rollback()
        .then(function () {
          reject(...args);
        });
    });
  }
}
