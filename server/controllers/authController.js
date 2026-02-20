import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already in use' })

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'customer',
    })

    const token = generateToken(user._id, user.role)
    res.status(201).json({ token, user })
  } catch (err) {
    console.error('Register error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' })

    const token = generateToken(user._id, user.role)
    res.json({ token, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMe = async (req, res) => {
  res.json(req.user)
}
