export function renderAuditChart(container, data) {
  const { totalUp, totalDown, auditRatio, totalUpBonus } = data;
  
  const formatBytes = (bytes) => {
    const mb = bytes / 1000000;
    const kb = bytes / 1000;
    return mb >= 0.01 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} kB`;
  };

  const getRatioMessage = (ratio) => {
    if (ratio >= 1.5) return "Outstanding! ";
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

export function renderXPProgressChart(container, transactions, currentLevel = 0) {
  if (!transactions || transactions.length === 0) {
    container.innerHTML = '<p class="text-slate-400 text-center py-8">No XP data available</p>';
    return;
  }

  // Calculate cumulative XP
  let cumulativeXP = 0;
  const dataPoints = transactions.map(tx => {
    cumulativeXP += tx.amount;
    return { date: new Date(tx.createdAt), xp: cumulativeXP };
  });

  const maxXP = Math.max(...dataPoints.map(d => d.xp));
  const minDate = dataPoints[0].date;
  const maxDate = dataPoints[dataPoints.length - 1].date;
  const dateRange = maxDate - minDate;

  const w = 800, h = 300, p = { top: 20, right: 30, bottom: 40, left: 60 };
  const cw = w - p.left - p.right, ch = h - p.top - p.bottom;

  // Line path
  const line = dataPoints.map((pt, i) => {
    const x = p.left + (cw * ((pt.date - minDate) / dateRange));
    const y = p.top + ch - (ch * (pt.xp / maxXP));
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  // Y-axis labels
  const yLabels = Array.from({ length: 6 }, (_, i) => {
    const val = (maxXP / 5) * i;
    return { label: (val / 1000).toFixed(0), y: p.top + ch - (ch * (val / maxXP)) };
  });

  // X-axis labels - deduplicate dates
  const xLabels = [];
  const seenLabels = new Set();
  Array.from({ length: 7 }, (_, i) => {
    const idx = Math.floor((dataPoints.length - 1) * (i / 6));
    const pt = dataPoints[idx];
    const label = pt.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!seenLabels.has(label)) {
      seenLabels.add(label);
      xLabels.push({ label, x: p.left + (cw * ((pt.date - minDate) / dateRange)) });
    }
  });

  container.innerHTML = `
    <div class="flex flex-col h-full">
      <svg viewBox="0 0 ${w} ${h}" class="w-full flex-1">
        <defs>
          <linearGradient id="xpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
          </linearGradient>
        </defs>
        
        ${yLabels.map(({ y }) => `<line x1="${p.left}" y1="${y}" x2="${w - p.right}" y2="${y}" stroke="#334155" stroke-dasharray="3,3" opacity="0.3"/>`).join('')}
        
        <path d="${line} L ${w - p.right} ${p.top + ch} L ${p.left} ${p.top + ch} Z" fill="url(#xpGrad)"/>
        <path d="${line}" stroke="#8b5cf6" stroke-width="2.5" fill="none"/>
        
        <line x1="${p.left}" y1="${p.top}" x2="${p.left}" y2="${p.top + ch}" stroke="#475569" stroke-width="2"/>
        <line x1="${p.left}" y1="${p.top + ch}" x2="${w - p.right}" y2="${p.top + ch}" stroke="#475569" stroke-width="2"/>
        
        ${yLabels.map(({ label, y }) => `<text x="${p.left - 10}" y="${y + 4}" fill="#94a3b8" font-size="11" text-anchor="end">${label}</text>`).join('')}
        ${xLabels.map(({ label, x }) => `<text x="${x}" y="${p.top + ch + 25}" fill="#94a3b8" font-size="10" text-anchor="middle">${label}</text>`).join('')}
        
        <text x="${p.left - 45}" y="${h / 2}" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle" transform="rotate(-90, ${p.left - 45}, ${h / 2})">XP (kB)</text>
      </svg>
      
      <div class="flex justify-between items-center mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
        <div>
          <div class="text-sm text-slate-400">Current XP</div>
          <div class="text-2xl font-bold text-purple-400">${(maxXP / 1000).toFixed(1)} kB</div>
        </div>
        <div class="text-right">
          <div class="text-sm text-slate-400">Current Level</div>
          <div class="text-2xl font-bold text-slate-200">${currentLevel}</div>
        </div>
      </div>
    </div>
  `;
}
