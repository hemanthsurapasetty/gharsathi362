const jwt = require('jsonwebtoken')

function requireAuth(req, res, next) {
  const token = req.cookies?.gharsathi_session
  if (!token) return res.status(401).json({ error: 'Please sign in to continue.' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'gharsathi' })
    req.userId = Number(payload.sub)
    if (!Number.isSafeInteger(req.userId)) throw new Error('Invalid account identifier')
    return next()
  } catch {
    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' })
  }
}

module.exports = { requireAuth }
