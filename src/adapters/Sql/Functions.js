import Functions from '../../Functions';

export default class SqlFunctions extends Functions {
  constructor(...args) {
    super(...args);

    this.builder = this.query.builder;

    this.column = args[1];

    this.funcs = [];
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
    let str = '';

    this.funcs.forEach((funcName, i) => {
      if (i === 0) {
        str = `${funcName}(${columnName})`;

        return;
      }

      str = `${funcName}(${str})`;
    });

    return str;
  }
}
