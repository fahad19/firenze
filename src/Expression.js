// ## Expression
//
export default class Expression {
  constructor(query) {
    this.query = query;
  }

  and() { return this; }

  or() { return this; }

  not() { return this; }

  eq() { return this; }

  notEq() { return this; }

  lt() { return this; }

  lte() { return this; }

  gt() { return this; }

  gte() { return this; }

  isNull() { return this; }

  isNotNull() { return this; }

  in() { return this; }

  notIn() { return this; }

  like() { return this; }

  notLike() { return this; }

  between() { return this; }

  notBetween() { return this; }

  count() { return this; }
}
