export function formatMoney(pence: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export function getLineTotal(unitPrice: number, quantity: number) {
  return unitPrice * Math.max(1, quantity);
}
