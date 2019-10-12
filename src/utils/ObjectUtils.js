export function isAnyNull(...args) {
  return args.findIndex(x => x == null) !== -1;
}

export function areStringsEqual(a, b) {
  if (a == null || b == null) {
    return a == null && b == null;
  }

  return a.localeCompare(b) === 0;
}
