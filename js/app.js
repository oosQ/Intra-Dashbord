import {getToken, logoutUser} from "./auth.js";

const currentPath = window.location.pathname;
const token = getToken();

// Check if user is on login page (handles /, /index.html, or ending with /)
const isLoginPage = currentPath === "/" || currentPath === "/index.html" || currentPath.endsWith("/index.html");
const isProfilePage = currentPath === "/profile.html" || currentPath.endsWith("/profile.html");

if (token && isLoginPage) {
  window.location.href = "./profile.html";
}

if (!token && isProfilePage) {
  window.location.href = "./index.html";
}

// Logout button handler  
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logoutUser();
  });
}
