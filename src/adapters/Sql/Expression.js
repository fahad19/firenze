import Expression from '../../Expression';

export default class SqlExpression extends Expression {
  constructor(...args) {
    super(...args);

    this.builder = (typeof args[1] !== 'undefined') ? args[1] : null;
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
}
