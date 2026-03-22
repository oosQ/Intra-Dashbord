import { calculateTotalXP } from "./utils.js";

export const DOM = {
  userCard: document.getElementById("user-info-card"),
  xpCard: document.getElementById("xp-card"),
  loadingState: document.getElementById("loading-state"),
  profileContent: document.getElementById("profile-content"),
  profileError: document.getElementById("profile-error"),
};


export function renderXPInfo(transactions) {
  const totalXP = calculateTotalXP(transactions);
  const toKB = (bytes) => (bytes / 1000).toFixed(1);
  
  DOM.xpCard.innerHTML = `
    <div class="space-y-4">
      <!-- Total XP Display -->
      <div class="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
        <div class="text-sm text-slate-400 mb-2">Total XP Earned</div>
        <div class="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ${toKB(totalXP)} kB
        </div>
        <div class="text-slate-400 text-xs mt-2">${transactions.length} projects completed</div>
      </div>

      <!-- Transactions List -->
      <div>
        <h3 class="text-sm font-semibold text-slate-300 mb-3 flex items-center">
          <span class="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
          Recent XP Transactions
        </h3>
        <ul class="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
          ${transactions.slice().reverse().map(tx => `
            <li class="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 transition-colors">
              <div class="flex justify-between items-start mb-1">
                <span class="font-medium text-slate-200 text-sm">${tx.object.name}</span>
                <span class="text-purple-400 font-bold text-sm">${toKB(tx.amount)} kB</span>
              </div>
              <div class="text-xs text-slate-500">${new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>
  `; 
}

export function renderUserInfo(user) {
  DOM.userCard.innerHTML = `
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
        <span class="text-slate-400">Full Name:</span>
        ${user.firstName} ${user.lastName}
      </p>
      <p>
        <span class="text-slate-400">Email:</span>
        ${user.email}
      </p>

      <p>
        <span class="text-slate-400">Qualification:</span>
        ${user.attrs.qualification || "N/A"}
      </p>

      <p>
        <span class="text-slate-400">Degree:</span>
        ${user.attrs.Degree || "N/A"}
      </p>

      <p>
        <span class="text-slate-400">Job Title:</span>
        ${user.attrs.jobtitle || "N/A"}
      </p>

      <p>
        <span class="text-slate-400">CPR:</span>
        ${user.attrs.CPRnumber || "N/A"}
      </p>

      <p>
        <span class="text-slate-400">Phone:</span>
        +973 ${user.attrs.PhoneNumber || "N/A"}
      </p>

      <p>
        <span class="text-slate-400">Address:</span>
        ${user.attrs.addressStreet || ""} ${user.attrs.addressCity || ""} ${user.attrs.addressCountry || ""}
      </p>

      <p>
        <span class="text-slate-400">Date of Birth:</span>
        ${user.attrs.dateOfBirth ? new Date(user.attrs.dateOfBirth).toLocaleDateString() : "N/A"}
      </p>

    </div>
  `;
}

export function renderAuditChart(container, data) {
  const { totalUp, totalDown, auditRatio, totalUpBonus } = data;
  
  const formatBytes = (bytes) => {
    const mb = bytes / 1000000;
    const kb = bytes / 1000;
    return mb >= 0.01 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} kB`;
  };

  const getRatioMessage = (ratio) => {
    if (ratio >= 1.5) return "Outstanding! 🌟";
    if (ratio >= 1.2) return "Almost perfect!";
    if (ratio >= 1.0) return "Great job!";
    if (ratio >= 0.8) return "Keep going!";
    return "Need more audits";
  };
  
  const maxValue = Math.max(totalUp + totalUpBonus, totalDown, 1);
  const upHeight = (totalUp / maxValue) * 120;
  const bonusHeight = (totalUpBonus / maxValue) * 120;
  const downHeight = (totalDown / maxValue) * 120;

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Bar Chart -->
      <svg viewBox="0 0 380 220" class="w-full">
        <!-- Y-axis -->
        <line x1="50" y1="20" x2="50" y2="160" stroke="#475569" stroke-width="2"/>
        
        <!-- X-axis -->
        <line x1="50" y1="160" x2="320" y2="160" stroke="#475569" stroke-width="2"/>
        
        <!-- Grid lines -->
        ${[0, 1, 2, 3, 4].map(i => {
          const y = 160 - (i * 30);
          const value = ((maxValue / 1000000) * (i / 4)).toFixed(1);
          return `
            <line x1="50" y1="${y}" x2="320" y2="${y}" stroke="#334155" stroke-width="1" opacity="0.8" stroke-dasharray="3,3"/>
            <text x="40" y="${y + 4}" fill="#64748b" font-size="10" text-anchor="end">${value}</text>
          `;
        }).join('')}
        
        <!-- Y-axis label -->
        <text x="15" y="90" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle" transform="rotate(-90, 15, 90)">MB</text>
        
        <!-- Done Bar (base) -->
        <rect x="100" y="${160 - upHeight - bonusHeight}" width="60" height="${upHeight}" fill="#10b981" rx="4"/>
        
        <!-- Bonus Bar (stacked on top) -->
        <rect x="100" y="${160 - bonusHeight}" width="60" height="${bonusHeight}" fill="#fbbf24" rx="4"/>
        
        <!-- Received Bar -->
        <rect x="220" y="${160 - downHeight}" width="60" height="${downHeight}" fill="#ef4444" rx="4"/>
        
        <!-- Labels -->
        <text x="130" y="180" fill="#94a3b8" font-size="13" font-weight="600" text-anchor="middle">Done</text>
        <text x="250" y="180" fill="#94a3b8" font-size="13" font-weight="600" text-anchor="middle">Received</text>
      </svg>

      <!-- Stats Display -->
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div class="text-slate-400 text-sm mb-2">Done</div>
          <div class="text-2xl font-bold text-emerald-400">
            ${formatBytes(totalUp)}<span class="text-amber-400 text-lg"> + ${formatBytes(totalUpBonus)}</span>
          </div>
        </div>
        <div class="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div class="text-slate-400 text-sm mb-2">Received</div>
          <div class="text-2xl font-bold text-rose-400">${formatBytes(totalDown)}</div>
        </div>
      </div>

      <!-- Audit Ratio -->
      <div class="text-center p-5 bg-sky-500/10 rounded-lg border border-sky-500/30">
        <div class="text-5xl font-bold text-sky-400">${auditRatio.toFixed(1)} <span class="text-lg text-slate-300 font-medium ml-2">${getRatioMessage(auditRatio)}</span></div>
      </div>
    </div>
  `;
}