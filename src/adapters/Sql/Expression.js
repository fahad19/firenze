import Expression from '../../Expression';

export default class SqlExpression extends Expression {
  eq(field, value) {
    this.query.where({
      [field]: value
    });
  }
}
