import Expression from '../../Expression';

export default class SqlExpression extends Expression {
  eq(field, value) {
    this.query.where({
      [field]: value
    });
  }

  notEq(field, value) {
    this.query.where(field, '<>', value);
  }

  lt(field, value) {
    this.query.where(field, '<', value);
  }

  lte(field, value) {
    this.query.where(field, '<=', value);
  }

  gt(field, value) {
    this.query.where(field, '>', value);
  }

  gte(field, value) {
    this.query.where(field, '>=', value);
  }
}
