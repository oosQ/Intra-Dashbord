import { calculateTotalXP } from "./utils.js";
import { renderAuditChart, renderXPProgressChart } from "./graphs.js";

export { renderAuditChart, renderXPProgressChart };

export const DOM = {
  userCard: document.getElementById("user-info-card"),
  xpCard: document.getElementById("xp-card"),
  loadingState: document.getElementById("loading-state"),
  profileContent: document.getElementById("profile-content"),
  profileError: document.getElementById("profile-error"),
};


export function renderXPInfo(transactions) {
  const toKB = (bytes) => (bytes / 1000).toFixed(1);
  
  DOM.xpCard.innerHTML = `
    <div class="space-y-4">
      <!-- Completed Projects Display -->
      <div class="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
        <div class="text-sm text-slate-400 mb-2">Completed Projects</div>
        <div class="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ${transactions.length}
        </div>
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
  const formatAddress = () => {
    const parts = [user.attrs.addressStreet, user.attrs.addressCity, user.attrs.addressCountry].filter(Boolean);
    return parts.length ? parts.join(', ') : 'N/A';
  };

  DOM.userCard.innerHTML = `
    <div class="space-y-4">
      <!-- Profile Header -->
      <div class="text-center pb-4 border-b border-slate-700">
        <div class="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-sky-400 to-purple-500 rounded-full flex items-center justify-center">
          <i class="fas fa-user text-3xl text-white"></i>
        </div>
        <div class="text-xs text-slate-500 mb-1">#${user.id}</div>
        <h2 class="text-2xl font-bold text-white mb-1">${user.firstName} ${user.lastName}</h2>
        <div class="text-sm text-slate-400"><i class="fas fa-at text-sky-400"></i> ${user.login}</div>
      </div>

      <!-- Contact Info -->
      <div class="space-y-3">
        <div class="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
          <i class="fas fa-envelope text-sky-400 w-5"></i>
          <div class="flex-1 min-w-0">
            <div class="text-xs text-slate-500">Email</div>
            <div class="text-sm text-slate-200 truncate">${user.email}</div>
          </div>
        </div>

        <div class="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
          <i class="fas fa-phone text-green-400 w-5"></i>
          <div class="flex-1">
            <div class="text-xs text-slate-500">Phone</div>
            <div class="text-sm text-slate-200">+973 ${user.attrs.PhoneNumber || 'N/A'}</div>
          </div>
        </div>

        <div class="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
          <i class="fas fa-location-dot text-red-400 w-5"></i>
          <div class="flex-1">
            <div class="text-xs text-slate-500">Address</div>
            <div class="text-sm text-slate-200">${formatAddress()}</div>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700">
        <div class="p-3 bg-slate-800/30 rounded-lg">
          <i class="fas fa-briefcase text-amber-400 text-xs mb-1"></i>
          <div class="text-xs text-slate-500">Job Title</div>
          <div class="text-sm text-slate-200 font-medium">${user.attrs.jobtitle || 'N/A'}</div>
        </div>
        
        <div class="p-3 bg-slate-800/30 rounded-lg">
          <i class="fas fa-graduation-cap text-purple-400 text-xs mb-1"></i>
          <div class="text-xs text-slate-500">Education</div>
          <div class="text-sm text-slate-200 font-medium">${user.attrs.Degree || user.attrs.qualification || 'N/A'}</div>
        </div>

        <div class="p-3 bg-slate-800/30 rounded-lg">
          <i class="fas fa-id-card text-blue-400 text-xs mb-1"></i>
          <div class="text-xs text-slate-500">CPR</div>
          <div class="text-sm text-slate-200 font-medium">${user.attrs.CPRnumber || 'N/A'}</div>
        </div>

        <div class="p-3 bg-slate-800/30 rounded-lg">
          <i class="fas fa-cake-candles text-pink-400 text-xs mb-1"></i>
          <div class="text-xs text-slate-500">Birthday</div>
          <div class="text-sm text-slate-200 font-medium">${user.attrs.dateOfBirth ? new Date(user.attrs.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
        </div>
      </div>
    </div>
  `;
}

