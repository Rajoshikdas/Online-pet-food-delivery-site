/**
 * Product data - fallback when API is unavailable.
 * Primary data comes from MongoDB via API.
 */

export const BEST_SELLING = [
  { id: 1, name: 'Taste of The Wild High Prairie Grain-Free Dog Food', description: 'Premium grain-free formula with roasted bison and venison.', price: 139.20, discount: 10, image: null, dosage: '1 cup per 20 lbs twice daily.', ingredients: ['Roasted bison', 'Venison', 'Sweet potatoes'], usage: 'Adult dogs, grain-free' },
  { id: 2, name: 'Meow Mix Tender Centers Dry Cat Food, Salmon', description: 'Tender salmon-filled cat food with crunchy coating.', price: 112.00, discount: null, image: null, dosage: '1/4–1/2 cup per 5 lbs daily.', ingredients: ['Corn', 'Salmon'], usage: 'Adult cats' },
  { id: 3, name: 'Double Tuff Durable Treat Muffin Dog Chew Toy', description: 'Long-lasting chew toy for active dogs.', price: 125.99, discount: 15, image: null, dosage: 'N/A – chew toy.', ingredients: ['Natural rubber'], usage: 'Chewing, dental health' },
  { id: 4, name: 'Kaytee Food From The Wild Natural Snack Pet Rabbit', description: 'Wild-inspired natural snacks for rabbits.', price: 127.00, discount: null, image: null, dosage: '1–2 pieces daily.', ingredients: ['Timothy hay', 'Vegetables'], usage: 'Rabbits' },
  { id: 5, name: 'GoldBait Flake 100g Quinoa Balanced Diet Fish Feed', description: 'Premium quinoa-balanced flake food for goldfish.', price: 125.99, discount: 5, image: null, dosage: 'Pinch 2–3 times daily.', ingredients: ['Quinoa', 'Fish meal'], usage: 'Goldfish' },
  { id: 6, name: 'Nutri-Rich Adult Dry Dog Food Roasted Chicken', description: 'Complete nutrition with roasted chicken flavor.', price: 126.99, discount: null, image: null, dosage: '1–1.5 cups per 20 lbs daily.', ingredients: ['Chicken meal', 'Brown rice'], usage: 'Adult dogs' },
]

export const LATEST_ITEMS = BEST_SELLING.slice(0, 4)

/** Fallback when Products API fails - grouped by species */
export const FALLBACK_GROUPED = {
  dog: [
    { _id: 'fd1', name: 'Taste of The Wild High Prairie Grain-Free Dog Food', description: 'Premium grain-free formula with roasted bison and venison.', price: 139.20, discount: 10, category: 'Dog Food', species: 'dog', dosage: '1 cup per 20 lbs twice daily.', ingredients: ['Roasted bison', 'Venison', 'Sweet potatoes', 'Peas'], usage: 'Adult dogs, grain-free diets' },
    { _id: 'fd2', name: 'Nutri-Rich Adult Dry Dog Food Roasted Chicken', description: 'Complete nutrition with roasted chicken flavor.', price: 126.99, discount: 0, category: 'Dog Food', species: 'dog', dosage: '1–1.5 cups per 20 lbs daily.', ingredients: ['Chicken meal', 'Brown rice', 'Oatmeal'], usage: 'Adult dogs' },
    { _id: 'fd3', name: 'Double Tuff Durable Treat Muffin Dog Chew Toy', description: 'Long-lasting chew toy for active dogs.', price: 125.99, discount: 15, category: 'Dog Toys', species: 'dog', dosage: 'N/A – chew toy.', ingredients: ['Natural rubber'], usage: 'Chewing, dental health' },
  ],
  cat: [
    { _id: 'fc1', name: 'Meow Mix Tender Centers Dry Cat Food, Salmon', description: 'Tender salmon-filled cat food with crunchy coating.', price: 112.00, discount: 0, category: 'Cat Food', species: 'cat', dosage: '1/4–1/2 cup per 5 lbs daily.', ingredients: ['Corn', 'Soybean meal', 'Salmon'], usage: 'Adult cats' },
  ],
  bird: [
    { _id: 'fb1', name: 'Kaytee Supreme Parrot Bird Food Daily Blend', description: 'Premium blend of seeds, fruits, and veggies.', price: 116.99, discount: 0, category: 'Bird Food', species: 'bird', dosage: 'Per package instructions.', ingredients: ['Seeds', 'Fruits', 'Vegetables'], usage: 'Parrots, daily nutrition' },
  ],
  rabbit: [
    { _id: 'fr1', name: 'Kaytee Food From The Wild Natural Snack Pet Rabbit', description: 'Wild-inspired natural snacks for rabbits.', price: 127.00, discount: 0, category: 'Rabbit Food', species: 'rabbit', dosage: '1–2 pieces daily as treat.', ingredients: ['Timothy hay', 'Vegetables', 'Herbs'], usage: 'Rabbits, treats' },
  ],
  fish: [
    { _id: 'ff1', name: 'GoldBait Flake 100g Quinoa Balanced Diet Fish Feed', description: 'Premium quinoa-balanced flake food for goldfish.', price: 125.99, discount: 5, category: 'Fish Food', species: 'fish', dosage: 'Pinch 2–3 times daily.', ingredients: ['Quinoa', 'Fish meal', 'Spirulina'], usage: 'Goldfish, tropical fish' },
  ],
}
