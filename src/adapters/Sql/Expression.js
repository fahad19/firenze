import Expression from '../../Expression';

export default class SqlExpression extends Expression {
  eq(field, value) {
    this.query.where(field, '=', value);

    return this;
  }

  notEq(field, value) {
    this.query.where(field, '<>', value);

    return this;
  }

  lt(field, value) {
    this.query.where(field, '<', value);

    return this;
  }

  lte(field, value) {
    this.query.where(field, '<=', value);

    return this;
  }

  gt(field, value) {
    this.query.where(field, '>', value);

    return this;
  }

  gte(field, value) {
    this.query.where(field, '>=', value);

    return this;
  }

  like(field, value) {
    this.query.where(field, 'like', value);

    return this;
  }

  in(field, values) {
    this.query.where(field, 'in', values);

    return this;
  }

  notIn(field, values) {
    this.query.builder.whereNotIn(field, values);

    return this;
  }
}
