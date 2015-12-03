import Functions from '../../Functions';

export default class SqlFunctions extends Functions {
  constructor(...args) {
    super(...args);

    this.builder = this.query.builder;

    this.column = args[1];

    this.funcs = [];
  }

  setColumn(column) {
    this.column = column;
  }

  upper(field) {
    this.funcs.push('UPPER');

    return this;
  }

  lower(field) {
    this.funcs.push('LOWER');

    return this;
  }

  toString() {
    const columnName = this.column;
    let str = columnName;

    this.funcs.forEach((funcName, i) => {
      str = `${funcName}(${str})`;
    });

    return str;
  }
}
