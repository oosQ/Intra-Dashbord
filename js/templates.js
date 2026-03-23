import { renderAuditChart, renderXPProgressChart } from "./graphs.js";
import { toKB, formatDate } from "./utils.js";
export { renderAuditChart, renderXPProgressChart };

export const DOM = {
  userCard: document.getElementById("user-info-card"),
  xpCard: document.getElementById("xp-card"),
  loadingState: document.getElementById("loading-state"),
  profileContent: document.getElementById("profile-content"),
  profileError: document.getElementById("profile-error"),
};


export function renderXPInfo(transactions) {
  // Sort by amount descending
  const sortedTransactions = [...transactions].sort((a, b) => b.amount - a.amount);
  
  DOM.xpCard.innerHTML = `
    <div class="space-y-4">
      <!-- Completed Projects Display -->
      <div class="text-center p-6 bg-gradient-to-br from-[#10CFC9]/10 to-[#14E5DD]/10 rounded-xl border border-[#10CFC9]/30">
        <div class="text-sm text-slate-400 mb-2">Completed Projects</div>
        <div class="text-5xl font-bold bg-gradient-to-r from-[#10CFC9] to-[#14E5DD] bg-clip-text text-transparent">
          ${transactions.length}
        </div>
      </div>

      <!-- Transactions List -->
      <div>
        <h3 class="text-sm font-semibold text-slate-300 mb-3 flex items-center">
          <span class="w-2 h-2 bg-[#10CFC9] rounded-full mr-2"></span>
          Top XP Transactions
        </h3>
        <ul class="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
          ${sortedTransactions.map(tx => `
            <li class="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-[#10CFC9]/30 transition-colors">
              <div class="flex justify-between items-start mb-1">
                <span class="font-medium text-slate-200 text-sm">${tx.object.name}</span>
                <span class="text-[#10CFC9] font-bold text-sm">${toKB(tx.amount)} kB</span>
              </div>
              <div class="text-xs text-slate-500">${formatDate(tx.createdAt)}</div>
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

  const avatarImage = user.attrs.genders === 'Male' ? './assets/male.png' : './assets/female.png';

  DOM.userCard.innerHTML = `
    <div class="space-y-4">
      <!-- Profile Header -->
      <div class="text-center pb-4 border-b border-slate-700">
        <div class="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-[#10CFC9] to-[#0EA5A0] rounded-full flex items-center justify-center overflow-hidden ring-2 ring-[#10CFC9]/30">
          <img src="${avatarImage}" alt="${user.attrs.genders} avatar" class="w-full h-full object-cover rounded-full">
        </div>
        <div class="text-xs text-slate-500 mb-1">#${user.id}</div>
        <h2 class="text-2xl font-bold text-white mb-1">${user.firstName} ${user.lastName}</h2>
        <div class="text-sm text-slate-400"><i class="fas fa-at text-[#10CFC9]"></i> ${user.login}</div>
      </div>

      <!-- Contact Info -->
      <div class="space-y-3">
        <div class="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
          <i class="fas fa-envelope text-[#10CFC9] w-5"></i>
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
          <i class="fas fa-graduation-cap text-[#10CFC9] text-xs mb-1"></i>
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
          <div class="text-sm text-slate-200 font-medium">${user.attrs.dateOfBirth ? formatDate(user.attrs.dateOfBirth) : 'N/A'}</div>
        </div>
      </div>
    </div>
  `;
}

