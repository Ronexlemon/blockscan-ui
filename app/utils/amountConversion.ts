function formatAmount(amount: number) {
  if (amount === 0) return "0";
  if (amount > 1e15) return (amount / 1e18).toFixed(6);
  return amount.toString();
}

export {formatAmount}