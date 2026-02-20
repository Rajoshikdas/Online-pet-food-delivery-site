/**
 * Category and species configuration for the app.
 */

export const SPECIES_KEYS = ['dog', 'cat', 'bird', 'rabbit', 'fish']

export const SPECIES_CONFIG = {
  dog:    { label: 'Dog Products',    emoji: '🐕' },
  cat:    { label: 'Cat Products',    emoji: '🐈' },
  bird:   { label: 'Bird Products',   emoji: '🐦' },
  rabbit: { label: 'Rabbit Products', emoji: '🐇' },
  fish:   { label: 'Fish Products',   emoji: '🐠' },
}

/** Category cards for the Home page */
export const CATEGORY_CARDS = [
  { id: 'dog',    label: 'Domestic Dog', emoji: '🐕', bg: 'bg-sky-50',     border: 'border-sky-200'    },
  { id: 'cat',    label: 'Super Cat',    emoji: '🐈', bg: 'bg-purple-50',  border: 'border-purple-200' },
  { id: 'dog',    label: 'Super Dog',    emoji: '🦮', bg: 'bg-blue-50',    border: 'border-blue-200'   },
  { id: 'bird',   label: 'Local Bird',   emoji: '🐦', bg: 'bg-green-50',   border: 'border-green-200'  },
  { id: 'rabbit', label: 'Rabbit',       emoji: '🐇', bg: 'bg-orange-50',  border: 'border-orange-200' },
  { id: 'fish',   label: 'Gold Fish',    emoji: '🐠', bg: 'bg-teal-50',    border: 'border-teal-200'   },
]
