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
  }

  and(...args) {
    return applyConditions(this, 'andWhere', ...args);
  }

  or(...args) {
    return applyConditions(this, 'orWhere', ...args);
  }

  not(...args) {
    return applyConditions(this, 'whereNot', ...args);
  }

  eq(field, value) {
    this.builder.where(field, '=', value);

    return this;
  }

  notEq(field, value) {
    this.builder.where(field, '<>', value);

    return this;
  }

  lt(field, value) {
    this.builder.where(field, '<', value);

    return this;
  }

  lte(field, value) {
    this.builder.where(field, '<=', value);

    return this;
  }

  gt(field, value) {
    this.builder.where(field, '>', value);

    return this;
  }

  gte(field, value) {
    this.builder.where(field, '>=', value);

    return this;
  }

  like(field, value) {
    this.builder.where(field, 'like', value);

    return this;
  }

  notLike(field, value) {
    this.builder.whereNot(field, 'like', value);

    return this;
  }

  in(field, values) {
    this.builder.where(field, 'in', values);

    return this;
  }

  notIn(field, values) {
    this.builder.whereNotIn(field, values);

    return this;
  }

  isNull(field) {
    this.builder.whereNull(field);

    return this;
  }

  isNotNull(field) {
    this.builder.whereNotNull(field);

    return this;
  }

  between(field, from, to) {
    this.builder.whereBetween(field, [from, to]);

    return this;
  }

  notBetween(field, from, to) {
    this.builder.whereNotBetween(field, [from, to]);

    return this;
  }
}
