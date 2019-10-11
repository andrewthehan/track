export const zip = (...rows) =>
  [...rows[0]].map((_, c) => rows.map(row => row[c]));

const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base"
});

export const sortStringsBy = mapper => (a, b) =>
  collator.compare(mapper(a), mapper(b));
