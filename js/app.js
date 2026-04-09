import {getToken, logoutUser} from "./auth.js";

function checkAuthAndRedirect() {
  const currentPath = window.location.pathname;
  const token = getToken();

  // Check if user is on login page (handles /, /index.html, or ending with /)
  const isLoginPage = currentPath === "/" || currentPath === "/index.html" || currentPath.endsWith("/index.html");
  const isProfilePage = currentPath === "/profile.html" || currentPath.endsWith("/profile.html");

  if (token && isLoginPage) {
    window.location.replace("./profile.html");
  }

  if (!token && isProfilePage) {
    window.location.replace("./index.html");
  }
}

// Check on page load
checkAuthAndRedirect();

// Check when user navigates back/forward
window.addEventListener("popstate", checkAuthAndRedirect);

// Check when page becomes visible (tab switch)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    checkAuthAndRedirect();
  }
});

// Logout button handler  
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logoutUser();
  });
}
