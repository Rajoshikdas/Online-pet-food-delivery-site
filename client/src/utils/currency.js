/**
 * Format amount as Indian Rupee (INR)
 * @param {number} amount
 * @returns {string} e.g. "₹299.00"
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '₹0.00'
  return `₹${Number(amount).toFixed(2)}`
}

/**
 * Calculate discounted price from original price and discount percentage.
 * @param {number} price - Original price
 * @param {number} discount - Discount percentage (0-100)
 * @returns {number} Price after discount, rounded to 2 decimals
 */
export function getDiscountedPrice(price, discount) {
  if (price == null || isNaN(price)) return 0
  const p = Number(price)
  const d = Number(discount) || 0
  if (d <= 0) return Math.round(p * 100) / 100
  return Math.round(p * (1 - d / 100) * 100) / 100
}
