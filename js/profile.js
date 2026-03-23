import { QUERIES, fetchQuery } from "./queries.js";
import { renderUserInfo , DOM , renderXPInfo, renderAuditChart, renderXPProgressChart} from "./templates.js";

async function loadUserInfo() {
  try {
    const data = await fetchQuery(QUERIES.userDetails);
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
    const data = await fetchQuery(QUERIES.userAllXP);
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
    const data = await fetchQuery(QUERIES.auditRatio);
    const auditData = data.user[0];
    renderAuditChart(auditContainer, auditData);

    DOM.loadingState.classList.add("hidden");
  } catch (error) {
    console.error("Error loading audit ratio data:", error);
  }
}


async function loadXPProgressGraph() {
  const xpChartContainer = document.getElementById("xp-chart");
  try {
    const [xpData, levelData] = await Promise.all([
      fetchQuery(QUERIES.userAllXP),
      fetchQuery(QUERIES.userLevel)
    ]);
    const transactions = xpData.transaction;
    const level = levelData.transaction[0]?.amount || 0;
    renderXPProgressChart(xpChartContainer, transactions, level);
  } catch (error) {
    console.error("Error loading XP progress graph:", error);
    xpChartContainer.innerHTML = '<p class="text-red-400 text-center py-8">Failed to load XP progress</p>';
  }
}

loadUserInfo();
loadXPInfo();
loadXPProgressGraph();
loadAuditRatioGraph();
loadAuditRatioGraph();