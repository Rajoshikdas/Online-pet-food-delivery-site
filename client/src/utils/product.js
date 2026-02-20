/**
 * Product utility helpers.
 */

export function isFallbackProduct(p) {
  const id = p?._id ?? p?.id
  return !id || (typeof id === 'string' && id.startsWith('f'))
}
