require('dotenv').config()

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set to a unique value of at least 32 characters.')
}

const cors = require('cors')
const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const authRoutes = require('./routes/auth')
const homeProfileRoutes = require('./routes/homeProfile')

const app = express()
const allowedOrigin = process.env.WEB_ORIGIN || 'http://localhost:5173'
const port = Number(process.env.PORT) || 6000

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: allowedOrigin, credentials: true }))
app.use(express.json({ limit: '16kb' }))
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})
app.use((req, _res, next) => {
  const cookieHeader = req.headers.cookie || ''
  req.cookies = Object.fromEntries(cookieHeader.split(';').map((entry) => {
    const separator = entry.indexOf('=')
    if (separator === -1) return ['', '']
    const key = entry.slice(0, separator).trim()
    const value = entry.slice(separator + 1).trim()
    try { return [key, decodeURIComponent(value)] }
    catch { return [key, value] }
  }).filter(([key]) => key))
  next()
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Please try again in a little while.' },
})

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/home-profile', homeProfileRoutes)
app.use((error, _req, res, _next) => {
  console.error('API request failed:', error.message)
  return res.status(500).json({ error: 'Something went wrong. Please try again.' })
})

app.listen(port, () => {
  console.log(`GharSathi API listening on http://localhost:${port}`)
})
