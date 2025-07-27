export function calculateCartTotals(items: any[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax
  return {
    itemCount,
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
  }
}
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price)
}
export function validateCartQuantity(quantity: number, stock: number): boolean {
  return quantity > 0 && quantity <= stock
}