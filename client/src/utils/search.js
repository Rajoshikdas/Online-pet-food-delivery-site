/**
 * Search utilities - term normalization and parsing.
 */

const QUERY_NORMALIZE = {
  dogs: 'dog', cats: 'cat', birds: 'bird', rabbits: 'rabbit', fishes: 'fish',
  dog: 'dog', cat: 'cat', bird: 'bird', rabbit: 'rabbit', fish: 'fish',
}

export function getSearchTerms(q) {
  const words = q.toLowerCase().trim().split(/[\s.,;:!?]+/).filter(Boolean)
  const terms = new Set()
  for (const w of words) {
    terms.add(w)
    const norm = QUERY_NORMALIZE[w]
    if (norm && norm !== w) terms.add(norm)
  }
  return [...terms]
}
