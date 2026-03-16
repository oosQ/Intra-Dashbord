import { GET_USER_BASIC , fetchQuery } from "./queries.js";

const userCard = document.getElementById("user-info-card");
const loadingState = document.getElementById("loading-state");
const profileContent = document.getElementById("profile-content");
const profileError = document.getElementById("profile-error");

async function loadUserInfo() {
  try {
    const data = await fetchQuery(GET_USER_BASIC);
    const user = data.user[0];
    renderUserInfo(user);
    
    // Hide loading and show content
    loadingState.classList.add("hidden");
    profileContent.classList.remove("hidden");

  } catch (error) {
    console.error("Error loading user info:", error);
    loadingState.classList.add("hidden");
    profileError.textContent = error.message;
    profileError.classList.remove("hidden");
  }
}

function renderUserInfo(user) {

  userCard.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">User Info</h2>
    <div class="space-y-2 text-slate-300">
      <p>
        <span class="text-slate-400">ID:</span>
        ${user.id}
      </p>
      <p>
        <span class="text-slate-400">Login:</span>
        ${user.login}
      </p>
      <p>
        <span class="text-slate-400">First Name:</span>
        ${user.firstName}
      </p>
      <p>
        <span class="text-slate-400">Last Name:</span>
        ${user.lastName}
      </p>
      <p>
        <span class="text-slate-400">Email:</span>
        ${user.email}
      </p>
    </div>
  `;
}

loadUserInfo();