export function calculateTotalXP(transactions) {
  return transactions.reduce((sum, item) => {
    return sum + (item.amount || 0);
  }, 0);
}