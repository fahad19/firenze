import Promise from './Promise';

export default class Transaction {
  constructor(reference = null, options = {}) {
    this.reference = reference;
    this.options = options;
  }

  set(reference) {
    this.reference = reference;

    return this;
  }

  get() {
    return this.reference;
  }

  commit() {
    return new Promise.resolve(true);
  }

  rollback() {
    return new Promise.resolve(true);
  }
}
