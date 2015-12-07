import Functions from '../../Functions';

export default class SqlFunctions extends Functions {
  constructor(...args) {
    super(...args);

    this.builder = this.query.builder;
  }

// #### upper()
//
// Apply `UPPER()` function to column
//
  upper() { return this.addFunction('UPPER'); }

// #### lower()
//
// Apply `LOWER()` function to column
//
  lower() { return this.addFunction('LOWER'); }

// #### sum()
//
// Apply `SUM()` function to column
//
  sum() { return this.addFunction('SUM'); }

// #### avg()
//
// Apply `AVG()` function to column
//
  avg() { return this.addFunction('AVG'); }

// #### min()
//
// Apply `MIN()` function to column
//
  min() { return this.addFunction('MIN'); }

// #### max()
//
// Apply `MAX()` function to column
//
  max() { return this.addFunction('MAX'); }

// #### count()
//
// Apply `COUNT()` function to column
//
  count() { return this.addFunction('COUNT'); }

// #### now()
//
// SQL equivalent of `NOW()`
//
  now() { return this.addFunction('NOW'); }

// #### year()
//
// Apply `YEAR()` function to column
//
  year() { return this.addFunction('YEAR'); }

// #### month()
//
// Apply `MONTH()` function to column
//
  month() { return this.addFunction('MONTH'); }

// #### day()
//
// Apply `DAY()` function to column
//
  day() { return this.addFunction('DAY'); }

// #### week()
//
// Apply `WEEK()` function to column
//
  week() { return this.addFunction('WEEK'); }

// #### weekday()
//
// Apply `WEEKDAY()` function to column
//
  weekday() { return this.addFunction('WEEKDAY'); }

  trim() { return this.addFunction('TRIM'); }

// #### concat()
//
// Apply `CONCAT()` function to column
//
// Example:
//
// ```js
// query.select({
//   id_and_title: function (column) {
//     return column.concat('id', JSON.stringify(' '), 'title');
//   }
// })
// ```
//
// Now `id_and_title` field will be returned with `id` and `title` field's values separated by a space.
//
  concat(...args) {
    this.setColumn(args.join(', '));

    return this.addFunction('CONCAT');
  }

  toString() {
    let str = this.column ? this.column : '';

    this.funcs.forEach((funcName) => {
      str = `${funcName}(${str})`;
    });

    return str;
  }
}
