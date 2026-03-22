import { GET_USER_BASIC , GET_XP_TRANSACTIONS , GET_AUDIT_RATIO, fetchQuery } from "./queries.js";
import { renderUserInfo , DOM , renderXPInfo, renderAuditChart} from "./templates.js";

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

async function loadAuditRatioGraph() {
  const auditContainer = document.getElementById("pass-fail-chart");
  try {
    const data = await fetchQuery(GET_AUDIT_RATIO);
    const auditData = data.user[0];
    renderAuditChart(auditContainer, auditData);

    DOM.loadingState.classList.add("hidden");
  } catch (error) {
    console.error("Error loading audit ratio data:", error);
  }
}


loadUserInfo();
loadXPInfo();
loadAuditRatioGraph();