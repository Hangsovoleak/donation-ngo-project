// Central place for reading/writing auth tokens.
// Helps keep token logic consistent across the app.

//get item by access token and refresh token 
export function getAccessToken() {
  return localStorage.getItem("AdminToken");
}

//set item by access token and refresh token 
export function setAccessToken(token) {
  localStorage.setItem("AdminToken", token);
}

//get item by refresh token and access token 
export function getRefreshToken() {
  return localStorage.getItem("AdminRefreshToken");
}

//set item by refresh token and access token 
export function setRefreshToken(token) {
  localStorage.setItem("AdminRefreshToken", token);
}

//clear item by access token and refresh token and remove from local storage
export function clearTokens() {
  localStorage.removeItem("AdminToken");
  localStorage.removeItem("AdminRefreshToken");
}
