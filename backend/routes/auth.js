const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const { pool } = require('../db')
const { requireAuth } = require('../middleware/requireAuth')

const router = express.Router()
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000

function publicUser(row) {
  return { id: String(row.id), fullName: row.full_name, email: row.email }
}

function setSessionCookie(res, userId) {
  const token = jwt.sign({}, process.env.JWT_SECRET, {
    subject: String(userId),
    issuer: 'gharsathi',
    expiresIn: '12h',
  })
  res.cookie('gharsathi_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api',
    maxAge: SESSION_DURATION_MS,
  })
}

function validateCredentials({ fullName, email, password }, isRegistration) {
  if (isRegistration && (typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 120)) {
    return 'Enter your name (2 to 120 characters).'
  }
  if (typeof email !== 'string' || email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Enter a valid email address.'
  }
  if (typeof password !== 'string') return 'Enter your password.'
  if (isRegistration && (password.length < 10 || Buffer.byteLength(password, 'utf8') > 72)) {
    return 'Use a password of 10 to 72 bytes.'
  }
  if (!isRegistration && (password.length < 1 || Buffer.byteLength(password, 'utf8') > 72)) {
    return 'Enter a valid password.'
  }
  return null
}

router.post('/register', async (req, res, next) => {
  const validationError = validateCredentials(req.body || {}, true)
  if (validationError) return res.status(400).json({ error: validationError })

  const fullName = req.body.fullName.trim()
  const email = req.body.email.trim().toLowerCase()

  try {
    const passwordHash = await bcrypt.hash(req.body.password, 12)
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email',
      [fullName, email, passwordHash],
    )
    setSessionCookie(res, result.rows[0].id)
    return res.status(201).json({ user: publicUser(result.rows[0]) })
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'An account with this email already exists.' })
    return next(error)
  }
})

router.post('/login', async (req, res, next) => {
  const validationError = validateCredentials(req.body || {}, false)
  if (validationError) return res.status(400).json({ error: validationError })

  try {
    const result = await pool.query(
      'SELECT id, full_name, email, password_hash FROM users WHERE email = $1',
      [req.body.email.trim().toLowerCase()],
    )
    const row = result.rows[0]
    const validPassword = row && await bcrypt.compare(req.body.password, row.password_hash)
    if (!validPassword) return res.status(401).json({ error: 'Email or password is incorrect.' })

    setSessionCookie(res, row.id)
    return res.json({ user: publicUser(row) })
  } catch (error) {
    return next(error)
  }
})

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email FROM users WHERE id = $1',
      [req.userId],
    )
    if (!result.rows[0]) return res.status(401).json({ error: 'Account not found.' })
    return res.json({ user: publicUser(result.rows[0]) })
  } catch (error) {
    return next(error)
  }
})

router.post('/logout', (_req, res) => {
  res.clearCookie('gharsathi_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api',
  })
  return res.status(204).end()
})

module.exports = router
