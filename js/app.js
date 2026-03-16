import {getToken, logoutUser} from "./auth.js";

const currentPath = window.location.pathname;
const token = getToken();

if (token && currentPath === "/") {
  window.location.href = "/profile.html";
}

if (!token && currentPath === "/profile.html") {
    window.location.href = "/index.html";
}

// Logout button handler  
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logoutUser();
  });
}
