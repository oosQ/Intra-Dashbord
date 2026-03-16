export const AUTH_URL = "https://learn.reboot01.com/api/auth/signin";
export const GRAPHQL_URL = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";
export const TOKEN_KEY = "jwt_token";

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export async function loginUser(usernameOrEmail, password) {
  // Encode credentials to base64 for Basic Authentication
  const credentials = btoa(`${usernameOrEmail}:${password}`);

  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    throw new Error("Invalid username/email or password");
  }

  const token = await response.text();

  if (!token) {
    throw new Error("No token received from server");
  }

  // Trim whitespace and remove any quotes
  const cleanToken = token.trim().replace(/^["']|["']$/g, '');
  
  saveToken(cleanToken);
  return cleanToken;
}

export function logoutUser() {
  removeToken();
  window.location.href = "./index.html";
}