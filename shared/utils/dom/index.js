export function childOf(c, p) {
  if (c === p) {
    return true;
  }
  while (c !== p && c) {
    c = c.parentNode;
  }
  return !!c;
}
