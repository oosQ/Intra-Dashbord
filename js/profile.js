import { GET_USER_BASIC , GET_XP_TRANSACTIONS , fetchQuery } from "./queries.js";
import { renderUserInfo , DOM , renderXPInfo} from "./templates.js";

async function loadUserInfo() {
  try {
    const data = await fetchQuery(GET_USER_BASIC);
    const user = data.user[0];
    renderUserInfo(user);
    
    // Hide loading and show content
    DOM.loadingState.classList.add("hidden");
    DOM.profileContent.classList.remove("hidden");

  } catch (error) {
    console.error("Error loading user info:", error);
    DOM.loadingState.classList.add("hidden");
    DOM.profileError.textContent = error.message;
    DOM.profileError.classList.remove("hidden");
  }
}

async function loadXPInfo() {
  try {
    const data = await fetchQuery(GET_XP_TRANSACTIONS);
    const transactions = data.transaction;
    renderXPInfo(transactions);

    DOM.loadingState.classList.add("hidden");

  } catch (error) {
    console.error("Error loading XP info:", error);
  }
}

// Load user info on page load


loadUserInfo();
loadXPInfo();