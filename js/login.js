import { loginUser, isAuthenticated , logoutUser} from "./auth.js";

const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("toggle-password");
const passwordIcon = document.getElementById("password-icon");

if (isAuthenticated()) {
  window.location.href = "./profile.html";
}

// Toggle password visibility
togglePasswordBtn.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  passwordIcon.className = isPassword ? "fas fa-eye-slash" : "fas fa-eye";
});

// Login form submit handler
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";

  const formData = new FormData(loginForm);
  const usernameOrEmail = formData.get("usernameOrEmail")?.trim();
  const password = formData.get("password")?.trim();

  if (!usernameOrEmail || !password) {
    errorMessage.textContent = "Please fill in all fields.";
    return;
  }

  try {
    await loginUser(usernameOrEmail, password);
    window.location.href = "./profile.html";
  } catch (error) {
    errorMessage.textContent = error.message || "Login failed.";
  }
});

// Logout button handler  
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logoutUser();
  });
}