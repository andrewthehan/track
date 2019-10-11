export function isAnyNull(...args) {
  return args.findIndex(x => x == null) !== -1;
}
