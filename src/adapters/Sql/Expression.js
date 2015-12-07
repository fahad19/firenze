/* eslint-disable no-use-before-define, no-invalid-this */
import Expression from '../../Expression';

function applyConditions(context, method, ...args) {
  if (typeof args[0] === 'object') {
    context.builder[method](...args);
  } else if (typeof args[0] === 'function') {
    context.builder[method](function () {
      const expr = new SqlExpression(context.query, this);
      args[0].apply(context.query, [expr]);
    });
  }

  return context;
}

export default class SqlExpression extends Expression {
  constructor(...args) {
    super(...args);

    this.builder = (typeof args[1] !== 'undefined') ? args[1] : null;

    this.options = (typeof args[2] !== 'undefined') ? args[2] : {
      joins: false
    };

    this.whereMethod = this.options.joins ? 'on' : 'where';
  }

// #### eq(column, value)
//
// Where column equals value.
//
  eq(field, value) {
    this.builder[this.whereMethod](field, '=', value);

    return this;
  }

// #### notEq(column, value)
//
// Where column doesn't equal to value.
//
  notEq(field, value) {
    this.builder[this.whereMethod](field, '<>', value);

    return this;
  }

// #### lt(column, value)
//
// Where column is less than value
//
  lt(field, value) {
    this.builder[this.whereMethod](field, '<', value);

    return this;
  }

// #### lte(column, value)
//
// Where column is less than or equal to value
//
  lte(field, value) {
    this.builder[this.whereMethod](field, '<=', value);

    return this;
  }

// #### gt(column, value)
//
// Where column is greater than value
//
  gt(field, value) {
    this.builder[this.whereMethod](field, '>', value);

    return this;
  }

// #### gte(column, value)
//
// Where column is greater than or equal to value
//
  gte(field, value) {
    this.builder[this.whereMethod](field, '>=', value);

    return this;
  }

// #### like(column, value)
//
// Where column is LIKE value.
//
// Example:
//
// ```js
// db.query()
//   .from('posts')
//   .where(function (expr) {
//     expr.like('title', '%hello%'); // where `title` contains the text `hello`
//   })
//   .run();
// ```
//
  like(field, value) {
    this.builder[this.whereMethod](field, 'like', value);

    return this;
  }

// #### notLike(column, value)
//
// Where column is not LIKE value.
//
  notLike(field, value) {
    this.builder.whereNot(field, 'like', value);

    return this;
  }

// #### in(column, values)
//
// Where column is one of the given values.
//
// Example:
//
// ```js
// db.query()
//   .from('users')
//   .where(function (expr) {
//     expr.in('id', [1, 2, 3]); // where `id` is either 1, 2, or 3.
//   });
// ```
//
  in(field, values) {
    this.builder[this.whereMethod](field, 'in', values);

    return this;
  }

// #### notIn(column, values)
//
// Where column is not one of the given values
//
  notIn(field, values) {
    this.builder.whereNotIn(field, values);

    return this;
  }

// #### isNull(column)
//
// Where column is `null`
//
  isNull(field) {
    this.builder.whereNull(field);

    return this;
  }

// #### isNotNull(column)
//
// Where column is not `null`
//
  isNotNull(field) {
    this.builder.whereNotNull(field);

    return this;
  }

// #### between(column, from, to)
//
// Where column is between from and to.
//
// Example:
//
// ```js
// db.query()
//   .from('posts')
//   .where(function (expr) {
//     expr.between('views_count', 1000, 2000); // where `views_count` is between 1000 and 2000
//   })
//   .run();
// ```
  between(field, from, to) {
    this.builder.whereBetween(field, [from, to]);

    return this;
  }

// #### notBetween(column, from, to)
//
// Where column is not between from and to.
//
  notBetween(field, from, to) {
    this.builder.whereNotBetween(field, [from, to]);

    return this;
  }

// #### and()
//
// Nests further conditions with `AND` operator.
//
// Example:
//
// ```js
// db.query()
//   .from('users')
//   .where(function (expr) {
//     expr
//       .eq('active', 1)
//       .and(function (expr) {
//         expr.eq('role_id', 2);
//       });
//   })
//   .run();
// ```
//
  and(...args) {
    return applyConditions(this, 'andWhere', ...args);
  }

// #### or()
//
// Nests further conditions with `OR` operator.
//
// Example:
//
// ```js
// db.query()
//   .from('users')
//   .where(function (expr) {
//     expr
//       .eq('active', 1)
//       .or(function (expr) {
//         expr.eq('super_admin', 1);
//       });
//   })
//   .run();
// ```
//
  or(...args) {
    return applyConditions(this, 'orWhere', ...args);
  }

// #### not()
//
// Nests further conditions with `NOT` operator.
//
// Example:
//
// ```js
// db.query()
//   .from('users')
//   .where(function (expr) {
//     expr
//       .eq('active', 1)
//       .not(function (expr) {
//         expr.eq('spammer', 1);
//       });
//   })
//   .run();
// ```
//
  not(...args) {
    return applyConditions(this, 'whereNot', ...args);
  }
}
