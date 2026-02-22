// Small helper functions for common validation/parsing.

//this using for verify and unverify
export function toBool(value) {
  //check value is boolean or not for verify and unverify
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
}

//this using for parse id and return number
export function parseId(value) {
  const n = Number(value);
  //check value is number or not
  return Number.isFinite(n) ? n : null;
}
