// Small helper functions for common validation/parsing.

//this using for verify and unverify
export function toBool(value) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
}

export function parseId(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
