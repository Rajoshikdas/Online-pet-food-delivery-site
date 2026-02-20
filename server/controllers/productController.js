import Product from '../models/Product.js'
import ProductReview from '../models/ProductReview.js'

const SPECIES_GROUPS = ['dog', 'cat', 'bird', 'rabbit', 'fish']

// Attach avgRating and reviewCount from ProductReview to products
async function attachProductRatings(products) {
  if (!products?.length) return products
  const ids = products.map(p => p._id)
  const stats = await ProductReview.aggregate([
    { $match: { product: { $in: ids } } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  const map = Object.fromEntries(stats.map(s => [String(s._id), { avgRating: Math.round(s.avgRating * 10) / 10, reviewCount: s.count }]))
  return products.map(p => {
    const s = map[String(p._id)]
    const { rating: _r, ...rest } = p
    return { ...rest, avgRating: s?.avgRating ?? null, reviewCount: s?.reviewCount ?? 0 }
  })
}

// Map plurals/variants to canonical form for flexible search
const WORD_NORMALIZE = {
  dogs: 'dog', dog: 'dog', canine: 'dog', canines: 'dog', puppy: 'dog', puppies: 'dog',
  cats: 'cat', cat: 'cat', feline: 'cat', felines: 'cat', kitten: 'cat', kittens: 'cat',
  birds: 'bird', bird: 'bird', parrots: 'bird', parrot: 'bird',
  rabbits: 'rabbit', rabbit: 'rabbit', bunnies: 'rabbit', bunny: 'rabbit',
  fishes: 'fish', fish: 'fish',
  foods: 'food', food: 'food', treats: 'treat', treat: 'treat',
  toys: 'toy', toy: 'toy', products: 'product', product: 'product',
}
const normalizeWord = (w) => WORD_NORMALIZE[w] || w

// Get all search terms including original and normalized forms
function getSearchTerms(raw) {
  const words = raw.split(/[\s.,;:!?]+/).filter(w => w.length > 0)
  const terms = new Set()
  for (const w of words) {
    terms.add(w)
    const norm = normalizeWord(w)
    if (norm !== w) terms.add(norm)
    if (w.length > 2 && w.endsWith('s') && !terms.has(w.slice(0, -1))) terms.add(w.slice(0, -1))
    if (w.length > 3 && w.endsWith('es') && !terms.has(w.slice(0, -2))) terms.add(w.slice(0, -2))
    if (w.length > 4 && w.endsWith('ies') && !terms.has(w.slice(0, -3) + 'y')) terms.add(w.slice(0, -3) + 'y')
  }
  return [...terms]
}

// GET /api/products → products grouped by species
export const getGroupedProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean()
    const withRatings = await attachProductRatings(products)
    const grouped = { dog: [], cat: [], bird: [], rabbit: [], fish: [] }

    for (const p of withRatings) {
      const species = p.species || 'all'
      if (species === 'all') {
        SPECIES_GROUPS.forEach(s => grouped[s].push({ ...p }))
      } else if (grouped[species]) {
        grouped[species].push(p)
      }
    }

    res.json(grouped)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/products/list?search=&category=&species=&page=1&limit=12 (filtered/paginated for backward compatibility)
export const getProducts = async (req, res) => {
  try {
    const { search, category, species, page = 1, limit = 12 } = req.query
    const query = {}

    if (search && search.trim()) {
      const raw = search.trim().toLowerCase()
      const searchTerms = getSearchTerms(raw)
      if (searchTerms.length > 0) {
        const orConditions = []
        for (const term of searchTerms) {
          const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          if (escaped.length < 2) continue
          orConditions.push(
            { name:      { $regex: escaped, $options: 'i' } },
            { category:  { $regex: escaped, $options: 'i' } },
            { description: { $regex: escaped, $options: 'i' } },
            { species:   { $regex: escaped, $options: 'i' } },
          )
        }
        if (orConditions.length > 0) query.$or = orConditions
      }
    }
    if (category && category !== 'all') query.category = { $regex: category, $options: 'i' }
    if (species  && species  !== 'all') query.species  = species

    const total    = await Product.countDocuments(query)
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean()

    const productsWithRatings = await attachProductRatings(products)
    res.json({ products: productsWithRatings, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/products/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category')
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean()
    if (!product) return res.status(404).json({ message: 'Product not found' })
    const [rated] = await attachProductRatings([{ ...product, _id: product._id }])
    const { rating: _r, ...rest } = product
    res.json({ ...rest, avgRating: rated?.avgRating ?? null, reviewCount: rated?.reviewCount ?? 0 })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Shared seed data (used by seedProducts and seedProductsIfEmpty)
const SEED_PRODUCTS = [
  // Dogs
  { name: 'Taste of The Wild High Prairie Grain-Free Dog Food', description: 'Premium grain-free formula with roasted bison and venison. Rich in protein and omega fatty acids for healthy skin and coat.', price: 139.20, discount: 10, category: 'Dog Food',   species: 'dog', dosage: '1 cup per 20 lbs body weight, twice daily. Adjust for activity level.', ingredients: ['Roasted bison', 'Roasted venison', 'Sweet potatoes', 'Peas', 'Egg product', 'Pea protein'], usage: 'Adult dogs, active breeds, grain-free diets' },
  { name: 'Nutri-Rich Adult Dry Dog Food Roasted Chicken',      description: 'Complete nutrition with roasted chicken flavor. Balanced for adult dogs.',         price: 126.99, discount: 0,  category: 'Dog Food',   species: 'dog', dosage: '1–1.5 cups per 20 lbs daily, split into 2 meals.', ingredients: ['Chicken meal', 'Brown rice', 'Oatmeal', 'Chicken fat', 'Flaxseed'], usage: 'Adult dogs, maintenance diet' },
  { name: 'Pedigree Dentastix Dental Treats for Dogs',          description: 'Clinically proven to reduce tartar build-up.',            price: 112.50, discount: 5,  category: 'Dog Treats', species: 'dog', dosage: '1 treat per day for medium-sized dogs.', ingredients: ['Cereal', 'Vegetable derivatives', 'Minerals', 'Sodium tripolyphosphate'], usage: 'Dental care, tartar reduction' },
  { name: 'Double Tuff Durable Treat Muffin Dog Chew Toy',      description: 'Long-lasting chew toy for active dogs.',                  price: 125.99, discount: 15, category: 'Dog Toys',   species: 'dog', dosage: 'N/A – use as chew toy.', ingredients: ['Natural rubber'], usage: 'Chewing, dental health, boredom relief' },
  { name: 'Royal Canin Breed Health Nutrition Adult Dog',        description: 'Tailored nutrition for specific breed requirements.',     price: 154.99, discount: 0,  category: 'Dog Food',   species: 'dog', dosage: 'See package for breed-specific portions.', ingredients: ['Chicken by-product meal', 'Brown rice', 'Oatmeal', 'Chicken fat'], usage: 'Breed-specific adult nutrition' },
  { name: 'Blue Buffalo Life Protection Dog Food',               description: 'Natural ingredients with vitamins and antioxidants.',     price: 144.99, discount: 8,  category: 'Dog Food',   species: 'dog', dosage: '1.5–2 cups per 25 lbs daily.', ingredients: ['Deboned chicken', 'Chicken meal', 'Brown rice', 'Barley', 'Oatmeal'], usage: 'Adult dogs, immune support' },
  // Cats
  { name: 'Meow Mix Tender Centers Dry Cat Food, Salmon',       description: 'Tender salmon-filled cat food with crunchy coating. Cats love the texture.',    price: 112.00, discount: 0,  category: 'Cat Food',   species: 'cat', dosage: '1/4–1/2 cup per 5 lbs body weight daily.', ingredients: ['Ground yellow corn', 'Soybean meal', 'Chicken by-product meal', 'Salmon'], usage: 'Adult cats, indoor cats' },
  { name: 'Whiskas Temptations Cat Treats Tasty Chicken',       description: 'Irresistible crunchy treats cats go crazy for.',         price: 108.49,  discount: 0,  category: 'Cat Treats', species: 'cat'    },
  { name: 'Royal Canin Indoor Adult Cat Dry Food',               description: 'Specially formulated for cats that live indoors.',       price: 138.99, discount: 12, category: 'Cat Food',   species: 'cat'    },
  { name: 'ScratchMaster Cardboard Cat Scratcher with Toy',     description: 'Durable cardboard scratcher keeps claws healthy.',       price: 118.99, discount: 0,  category: 'Cat Toys',   species: 'cat'    },
  { name: 'Iams ProActive Health Indoor Weight Cat Food',        description: 'Helps maintain healthy weight for indoor cats.',         price: 122.49, discount: 5,  category: 'Cat Food',   species: 'cat'    },
  { name: 'Purina Fancy Feast Gourmet Wet Cat Food Variety',    description: 'Gourmet flavors in rich gravy for picky eaters.',        price: 115.99, discount: 0,  category: 'Cat Food',   species: 'cat'    },
  // Birds
  { name: 'Kaytee Supreme Parrot Bird Food Daily Blend',        description: 'Premium blend of seeds, fruits, and veggies.',           price: 116.99, discount: 0,  category: 'Bird Food',  species: 'bird'   },
  { name: 'Zupreem FruitBlend Flavor Pellets Medium Birds',     description: 'Fruit-flavored pellets for medium-sized birds.',         price: 121.50, discount: 10, category: 'Bird Food',  species: 'bird'   },
  { name: 'Super Bird Creations Swing Rope Perch Bird Toy',     description: 'Natural rope swing for climbing and exercise.',          price: 114.99, discount: 0,  category: 'Bird Toys',  species: 'bird'   },
  { name: 'Vitakraft Crunch Sticks Variety Pack Budgie',        description: 'Crunchy snack sticks loved by budgies.',                 price: 109.75,  discount: 0,  category: 'Bird Treats',species: 'bird'   },
  // Rabbits
  { name: 'Kaytee Food From The Wild Natural Snack Pet Rabbit', description: 'Wild-inspired natural snacks for rabbits.',              price: 127.00, discount: 0,  category: 'Rabbit Food',species: 'rabbit' },
  { name: 'Oxbow Animal Health Bunny Basics Timothy Hay',       description: 'Premium Timothy hay essential for rabbit digestion.',    price: 119.99, discount: 5,  category: 'Rabbit Food',species: 'rabbit' },
  { name: 'Super Pet Rabbit Treat Apple Wood Chew Sticks',      description: 'Natural apple wood chews for dental health.',            price: 107.49,  discount: 0,  category: 'Rabbit Treats',species:'rabbit'},
  { name: 'Living World Deluxe Rabbit Habitat Cage',            description: 'Spacious habitat with hideout and feeding platform.',    price: 189.99, discount: 20, category: 'Rabbit Cages',species:'rabbit' },
  // Fish
  { name: 'GoldBait Flake 100g Quinoa Balanced Diet Fish Feed', description: 'Premium quinoa-balanced flake food for goldfish.',       price: 125.99, discount: 5,  category: 'Fish Food',  species: 'fish'   },
  { name: 'TetraMin Tropical Flakes Complete Fish Food',        description: 'Complete nutrition for tropical fish varieties.',         price: 111.99, discount: 0,  category: 'Fish Food',  species: 'fish'   },
  { name: 'API Freshwater Master Test Kit Aquarium Water Test', description: 'Tests pH, ammonia, nitrite, and nitrate levels.',        price: 134.99, discount: 8,  category: 'Fish Care',  species: 'fish'   },
  { name: 'Marineland Contour Glass Aquarium Kit LED Light',    description: 'Complete aquarium kit with LED lighting system.',        price: 159.99, discount: 15, category: 'Aquariums',  species: 'fish'   },
]

// Run on server startup: seed products if DB has none
export async function seedProductsIfEmpty() {
  const count = await Product.countDocuments()
  if (count > 0) return
  const inserted = await Product.insertMany(SEED_PRODUCTS)
  console.log(`Seeded ${SEED_PRODUCTS.length} products`)
  // Seed a few reviews for demo (only for first 2 products)
  const User = (await import('../models/User.js')).default
  const admin = await User.findOne({ role: 'admin' })
  if (admin && inserted.length >= 2) {
    try {
      await ProductReview.insertMany([
        { product: inserted[0]._id, user: admin._id, userName: admin.name, rating: 4.5, comment: 'Great quality!' },
        { product: inserted[1]._id, user: admin._id, userName: admin.name, rating: 4, comment: 'Good value.' },
      ])
      console.log('Seeded sample reviews for 2 products')
    } catch (e) { /* ignore */ }
  }
}

// POST /api/products/seed  (admin only - seeds demo data)
export const seedProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments()
    if (count > 0) return res.json({ message: `Already have ${count} products` })
    await Product.insertMany(SEED_PRODUCTS)
    res.json({ message: `Seeded ${SEED_PRODUCTS.length} products successfully` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/products (admin only)
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// PUT /api/products/:id (admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// DELETE /api/products/:id (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}