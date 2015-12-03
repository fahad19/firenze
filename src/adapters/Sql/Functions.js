import Functions from '../../Functions';

export default class SqlFunctions extends Functions {
  constructor(...args) {
    super(...args);

    this.builder = this.query.builder;
  }

  upper() { return this.addFunction('UPPER'); }

  lower() { return this.addFunction('LOWER'); }

  sum() { return this.addFunction('SUM'); }

  avg() { return this.addFunction('AVG'); }

  min() { return this.addFunction('MIN'); }

  max() { return this.addFunction('MAX'); }

  count() { return this.addFunction('COUNT'); }

  now() { return this.addFunction('NOW'); }

  year() { return this.addFunction('YEAR'); }

  month() { return this.addFunction('MONTH'); }

  day() { return this.addFunction('DAY'); }

  week() { return this.addFunction('WEEK'); }

  weekday() { return this.addFunction('WEEKDAY'); }

  trim() { return this.addFunction('TRIM'); }

  concat(...args) {
    this.setColumn(args.join(', '));

    return this.addFunction('CONCAT');
  }

  toString() {
    let str = this.column ? this.column : '';

    this.funcs.forEach((funcName, i) => {
      str = `${funcName}(${str})`;
    });

    return str;
  }
}
