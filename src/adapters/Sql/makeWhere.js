export default function makeWhere(query, method, ...args) {
  if (typeof args[0] !== 'function') {
    query.builder[method](...args);

    return query;
  }

  query.builder[method](function () {
    const expr = query.expr(this);

    args[0].apply(query, [expr]);
  });

  return query;
}
