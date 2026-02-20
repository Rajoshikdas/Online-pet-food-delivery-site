# FocoPet Client – Project Structure

## Directory Overview

```
src/
├── components/     # Reusable UI components (Navbar, Footer, ProductCard, etc.)
├── context/       # React context providers (Auth, Cart, Wishlist)
├── data/          # Static/fallback data - kept separate from logic
│   ├── products.js    # Product fallbacks (BEST_SELLING, FALLBACK_GROUPED)
│   ├── categories.js  # Species config, category cards
│   ├── reviews.js     # Default testimonials
│   └── index.js       # Central exports
├── pages/         # Route-level page components
├── services/      # API client and external services
├── utils/         # Pure utility functions (search, product helpers)
├── App.jsx        # Root app + routing
├── main.jsx       # Entry point
└── index.css      # Global styles
```

## Conventions

- **Data** → `src/data/` – Hardcoded data, mock data, constants. Import from here instead of embedding in components.
- **Logic** → Components and hooks – Business logic, state, event handlers.
- **Utilities** → `src/utils/` – Pure functions with no side effects (search, product helpers).
- **Styles** → Tailwind classes in JSX; global overrides in `index.css`.

## Adding New Data

1. Add the data to the appropriate file in `src/data/`.
2. Export from `src/data/index.js` if it should be shared.
3. Import where needed: `import { X } from '../data'`.
