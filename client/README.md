# FocoPet – Client

A pet food delivery web application built with React, Vite, and Tailwind CSS.

---

## Features

- Browse and search pet food products by name or category (dog, cat, bird, fish, etc.)
- User authentication (login/register)
- Shopping cart and checkout
- Wishlist to save favorite products
- Pet profile management (add/edit pets)
- Order history
- Prescription uploads
- Admin dashboard (manage orders, view feedback, add products)

---

## Tech Stack

- **React 18** – UI framework
- **Vite 5** – Build tool and dev server
- **React Router v6** – Client-side routing
- **Tailwind CSS 4** – Styling
- **Axios** – API requests
- **Font Awesome 6** – Icons

---

## Prerequisites

Before you begin, make sure you have:

1. **Node.js 18+** installed ([download here](https://nodejs.org/))
2. **npm** (comes with Node.js)
3. **Backend server running** – The client needs the API server to work properly. See `../server/README.md` for setup.

---

## Getting Started

### Step 1: Install dependencies

```bash
cd client
npm install
```

### Step 2: Start the backend server (in a separate terminal)

```bash
cd server
npm run dev
```

The backend runs at `http://localhost:8080`.

### Step 3: Start the client dev server

```bash
cd client
npm run dev
```

The app opens at **http://localhost:5173**.

---

## Available Scripts

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start development server (port 5173)  |
| `npm run build`   | Build for production (output: `dist/`) |
| `npm run preview` | Preview production build locally      |

---

## Project Structure

```
client/
├── public/
│   ├── css/           # Global and page-specific styles
│   └── fonts/         # Custom fonts
│
├── src/
│   ├── components/    # Reusable UI (Navbar, Footer, ProductCard, etc.)
│   ├── context/       # React Context (Auth, Cart, Wishlist)
│   ├── data/          # Static data and constants
│   ├── pages/         # Page components (Home, Products, Checkout, etc.)
│   ├── services/      # API client (Axios instance)
│   ├── utils/         # Helper functions (currency, search, etc.)
│   ├── App.jsx        # Main app with routes
│   ├── main.jsx       # Entry point
│   └── index.css      # Tailwind imports
│
├── index.html         # HTML template
├── vite.config.js     # Vite configuration (includes API proxy)
├── postcss.config.js  # PostCSS config for Tailwind
└── package.json       # Dependencies and scripts
```

---

## Pages & Routes

| Route             | Access    | Description                     |
| ----------------- | --------- | ------------------------------- |
| `/`               | Public    | Home page                       |
| `/products`       | Public    | Browse all products             |
| `/products/:id`   | Public    | View product details            |
| `/login`          | Public    | User login                      |
| `/register`       | Public    | User registration               |
| `/checkout`       | Public    | Cart checkout                   |
| `/wishlist`       | Public    | Saved products                  |
| `/profile`        | Login required | View/manage pet profiles   |
| `/onboarding`     | Login required | Add or edit a pet          |
| `/orders`         | Login required | View past orders           |
| `/prescriptions`  | Login required | Upload prescriptions       |
| `/dashboard`      | Admin only | Manage orders, feedback, products |

---

## API Connection

- **Development**: The Vite dev server proxies `/api/*` requests to `http://localhost:8080` (configured in `vite.config.js`).
- **Production**: Update `src/services/api.js` with your production API URL.

Make sure the backend is running for these features to work:
- Login / Register
- Cart & Checkout
- Wishlist
- Orders
- Pet profiles
- Admin dashboard

---

## Folder Conventions

| Folder          | What goes here                              |
| --------------- | ------------------------------------------- |
| `src/components/` | Reusable UI components                    |
| `src/pages/`      | Full page components (one per route)      |
| `src/context/`    | React Context providers                   |
| `src/data/`       | Static data, constants, fallback values   |
| `src/services/`   | API calls and external services           |
| `src/utils/`      | Pure helper functions                     |
| `public/css/`     | Global CSS files                          |

---

## Troubleshooting

**"Network Error" or API calls failing?**
- Make sure the backend server is running on port 8080.
- Check that MongoDB is connected (see server logs).

**Styles not loading?**
- Run `npm install` to ensure Tailwind is installed.
- Check browser console for CSS errors.

**Login not working?**
- Verify the backend is running and connected to the database.
- Check browser console and network tab for errors.

---

## License

This project is for educational/personal use.

---

Made with 🤍 by Sutapa
