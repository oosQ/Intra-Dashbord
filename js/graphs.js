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

export function renderXPProgressChart(container, projects, currentLevel = 0) {
  if (!projects || projects.length === 0) {
    container.innerHTML = '<p class="text-slate-400 text-center py-8">No project data available</p>';
    return;
  }

  // Calculate cumulative XP for each project
  let cumulativeXP = 0;
  const dataPoints = projects.map(project => {
    cumulativeXP += project.amount;
    return {
      name: project.object.name,
      date: new Date(project.createdAt),
      xp: cumulativeXP,
      earned: project.amount
    };
  });

  const maxXP = dataPoints[dataPoints.length - 1].xp;
  const minDate = dataPoints[0].date;
  const maxDate = dataPoints[dataPoints.length - 1].date;
  const dateRange = maxDate - minDate;

  // SVG dimensions
  const w = 800, h = 300;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // Helper to calculate coordinates
  const getX = (date) => padding.left + (chartW * ((date - minDate) / dateRange));
  const getY = (xp) => padding.top + chartH - (chartH * (xp / maxXP));

  // Generate line path
  const linePath = dataPoints.map((pt, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(pt.date)} ${getY(pt.xp)}`
  ).join(' ');

  // Y-axis labels (XP values)
  const yLabels = Array.from({ length: 6 }, (_, i) => {
    const value = (maxXP / 5) * i;
    return { label: (value / 1000).toFixed(0), y: getY(value) };
  });

  // X-axis labels (dates) - deduplicate
  const xLabels = [];
  const seenDates = new Set();
  for (let i = 0; i < 7; i++) {
    const idx = Math.floor((dataPoints.length - 1) * (i / 6));
    const point = dataPoints[idx];
    const label = point.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!seenDates.has(label)) {
      seenDates.add(label);
      xLabels.push({ label, x: getX(point.date) });
    }
  }

  // Create tooltip element
  const tooltipId = 'xp-tooltip-' + Date.now();

  container.innerHTML = `
    <div class="flex flex-col h-full">
      <div class="relative">
        <svg viewBox="0 0 ${w} ${h}" class="w-full">
          <defs>
            <linearGradient id="xpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
            </linearGradient>
          </defs>
          
          <!-- Grid lines -->
          ${yLabels.map(({ y }) => 
            `<line x1="${padding.left}" y1="${y}" x2="${w - padding.right}" y2="${y}" stroke="#334155" stroke-dasharray="3,3" opacity="0.3"/>`
          ).join('')}
          
          <!-- Area fill -->
          <path d="${linePath} L ${w - padding.right} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z" fill="url(#xpGrad)"/>
          
          <!-- Line -->
          <path d="${linePath}" stroke="#8b5cf6" stroke-width="2.5" fill="none"/>
          
          <!-- Data points -->
          ${dataPoints.map((pt) => {
            const cx = getX(pt.date);
            const cy = getY(pt.xp);
            const escapedName = pt.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const dateStr = pt.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return `
              <circle 
                cx="${cx}" cy="${cy}" r="4" 
                fill="#8b5cf6" stroke="#1e293b" stroke-width="2"
                style="cursor: pointer; transition: all 0.2s;"
                onmouseenter="this.setAttribute('r', '6'); this.setAttribute('fill', '#a78bfa'); document.getElementById('${tooltipId}').style.display='block'; document.getElementById('${tooltipId}').innerHTML='<strong>${escapedName}</strong><br/>+${(pt.earned / 1000).toFixed(1)} kB<br/>${dateStr}'"
                onmouseleave="this.setAttribute('r', '4'); this.setAttribute('fill', '#8b5cf6'); document.getElementById('${tooltipId}').style.display='none'"
              />
            `;
          }).join('')}
          
          <!-- Axes -->
          <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartH}" stroke="#475569" stroke-width="2"/>
          <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${w - padding.right}" y2="${padding.top + chartH}" stroke="#475569" stroke-width="2"/>
          
          <!-- Y-axis labels -->
          ${yLabels.map(({ label, y }) => 
            `<text x="${padding.left - 10}" y="${y + 4}" fill="#94a3b8" font-size="11" text-anchor="end">${label}</text>`
          ).join('')}
          
          <!-- X-axis labels -->
          ${xLabels.map(({ label, x }) => 
            `<text x="${x}" y="${padding.top + chartH + 25}" fill="#94a3b8" font-size="10" text-anchor="middle">${label}</text>`
          ).join('')}
          
          <!-- Y-axis label -->
          <text x="${padding.left - 45}" y="${h / 2}" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle" transform="rotate(-90, ${padding.left - 45}, ${h / 2})">XP (kB)</text>
        </svg>
        
        <!-- Tooltip -->
        <div id="${tooltipId}" class="absolute top-4 right-4 bg-slate-800 border border-purple-500/50 rounded-lg px-4 py-2 text-sm text-slate-200 shadow-lg pointer-events-none" style="display: none;"></div>
      </div>
      
      <!-- Stats -->
      <div class="flex justify-between items-center mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
        <div>
          <div class="text-sm text-slate-400">Current XP</div>
          <div class="text-2xl font-bold text-purple-400">${(maxXP / 1000).toFixed(1)} kB</div>
        </div>
        <div class="text-center">
          <div class="text-sm text-slate-400">Projects</div>
          <div class="text-2xl font-bold text-slate-200">${projects.length}</div>
        </div>
        <div class="text-right">
          <div class="text-sm text-slate-400">Level</div>
          <div class="text-2xl font-bold text-slate-200">${currentLevel}</div>
        </div>
      </div>
    </div>
  `;
}
