import { useState, useEffect } from 'react'

const SPECIES_OPTIONS = ['dog', 'cat', 'bird', 'rabbit', 'fish', 'all']
const DEFAULT_FORM = { name: '', description: '', price: '', discount: 0, category: '', species: 'dog', image: '', stock: 100, dosage: '', ingredients: '', usage: '' }

export default function ProductFormModal({ open, onClose, onSubmit, product = null }) {
  const [form, setForm] = useState(DEFAULT_FORM)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        discount: product.discount ?? 0,
        category: product.category || '',
        species: product.species || 'dog',
        image: product.image || '',
        stock: product.stock ?? 100,
        dosage: product.dosage || '',
        ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : (product.ingredients || ''),
        usage: product.usage || '',
      })
    } else {
      setForm(DEFAULT_FORM)
    }
  }, [product, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'price' || name === 'discount' || name === 'stock' ? (value === '' ? '' : Number(value)) : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ing = (form.ingredients || '').split(',').map(s => s.trim()).filter(Boolean)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discount: Number(form.discount) || 0,
      category: form.category.trim(),
      species: form.species,
      image: form.image.trim(),
      stock: Number(form.stock) || 100,
      dosage: (form.dosage || '').trim(),
      ingredients: ing,
      usage: (form.usage || '').trim(),
    }
    try {
      await onSubmit(payload)
      onClose()
    } catch (_) {
      // Parent shows alert on error; keep modal open so user can fix and retry
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Product name" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Product description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Discount %</label>
              <input type="number" name="discount" value={form.discount} onChange={handleChange} min="0" max="100"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
            <input name="category" value={form.category} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="e.g. Dog Food" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Species</label>
            <select name="species" value={form.species} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300">
              {SPECIES_OPTIONS.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} type="url"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="https://example.com/image.jpg" />
            {form.image && (
              <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="100" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dosage</label>
            <textarea name="dosage" value={form.dosage} onChange={handleChange} rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="e.g. 1 cup per 10 lbs body weight twice daily" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ingredients (comma-separated)</label>
            <input name="ingredients" value={form.ingredients} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Chicken, rice, vegetables, vitamins" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">What it&apos;s for / Usage</label>
            <textarea name="usage" value={form.usage} onChange={handleChange} rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="e.g. Adult dogs, weight management, sensitive stomachs" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-700 transition">
              {product ? 'Update' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
