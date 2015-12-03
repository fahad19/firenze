import Functions from '../../Functions';

export default class SqlFunctions extends Functions {
  constructor(...args) {
    super(...args);

    this.builder = this.query.builder;
  }

  upper(field) {
    return this.addFunction('UPPER');
  }

  lower(field) {
    return this.addFunction('LOWER');
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
