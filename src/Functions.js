export default class Functions {
  constructor(...args) {
    this.query = args[0];

    this.column = args[1];
    this.funcs = [];
  }

  addFunction(funcName) {
    this.funcs.push(funcName);

    return this;
  }

  setColumn(column) {
    this.column = column;

    return this;
  }

  upper() { return this; }

  lower() { return this; }

  concat() { return null; }

  sum() { return this; }

  avg() { return this; }

  min() { return this; }

  max() { return this; }

  count() { return this; }

  now() { return null; }
}
