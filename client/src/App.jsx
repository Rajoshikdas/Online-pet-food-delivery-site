import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home           from './pages/Home'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Prescriptions  from './pages/Prescriptions'
import Dashboard      from './pages/Dashboard'
import Products       from './pages/Products'
import ProductDetail  from './pages/ProductDetail'
import Checkout       from './pages/Checkout'
import Wishlist       from './pages/Wishlist'
import Orders        from './pages/Orders'
import Profile       from './pages/Profile'
import Onboarding    from './pages/Onboarding'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute     from './components/AdminRoute'

export default function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/"           element={<Home />}       />
        <Route path="/login"      element={<Login />}      />
        <Route path="/register"   element={<Register />}   />
        <Route path="/products"   element={<Products />}   />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/checkout"   element={<Checkout />}   />
        <Route path="/wishlist"   element={<Wishlist />}   />
        <Route path="/orders"     element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

        {/* Protected – any logged in user */}
        <Route path="/prescriptions" element={
          <ProtectedRoute><Prescriptions /></ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="/dashboard" element={
          <AdminRoute><Dashboard /></AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}