// XP Calculations
export function calculateTotalXP(transactions) {
  return transactions.reduce((sum, item) => {
    return sum + (item.amount || 0);
  }, 0);
}

export function calculateCumulativeXP(transactions) {
  let cumulativeXP = 0;
  return transactions.map(tx => {
    cumulativeXP += tx.amount;
    return {
      name: tx.object.name,
      date: new Date(tx.createdAt),
      xp: cumulativeXP,
      earned: tx.amount
    };
  });
}

// Formatting Functions
export function formatBytes(bytes) {
  const mb = bytes / 1000000;
  const kb = bytes / 1000;
  return mb >= 0.01 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} kB`;
}

export function toKB(bytes) {
  return (bytes / 1000).toFixed(1);
}

export function formatDate(dateString, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Audit Ratio Helpers
export function getRatioMessage(ratio) {
  if (ratio >= 1.5) return "Outstanding! ";
  if (ratio >= 1.2) return "Almost perfect!";
  if (ratio >= 1.0) return "Great job!";
  if (ratio >= 0.8) return "Keep going!";
  return "Need more audits";
}

// Graph Helpers
export function generateYAxisLabels(maxValue, count = 6) {
  return Array.from({ length: count }, (_, i) => {
    const value = (maxValue / (count - 1)) * i;
    return { label: (value / 1000).toFixed(0), value };
  });
}

export function deduplicateDateLabels(dataPoints, getX, labelCount = 7) {
  const xLabels = [];
  const seenDates = new Set();
  for (let i = 0; i < labelCount; i++) {
    const idx = Math.floor((dataPoints.length - 1) * (i / (labelCount - 1)));
    const point = dataPoints[idx];
    const label = point.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!seenDates.has(label)) {
      seenDates.add(label);
      xLabels.push({ label, x: getX(point.date) });
    }
  }
  return xLabels;
}

export function escapeHtml(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}