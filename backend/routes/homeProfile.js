const express = require('express')
const { pool } = require('../db')
const { requireAuth } = require('../middleware/requireAuth')

const router = express.Router()
router.use(requireAuth)

function profileFromRow(row) {
  if (!row) return null
  return {
    city: row.city,
    plotWidthFt: Number(row.plot_width_ft),
    plotLengthFt: Number(row.plot_length_ft),
    builtUpAreaSqft: Number(row.built_up_area_sqft),
    floors: row.floors,
    bedrooms: row.bedrooms,
    budgetInr: row.budget_inr === null ? null : Number(row.budget_inr),
    updatedAt: row.updated_at,
  }
}

function validPositiveNumber(value, max) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= max
}

function validateProfile(body) {
  if (typeof body.city !== 'string' || body.city.trim().length < 2 || body.city.trim().length > 120) {
    return 'Enter your city or town.'
  }
  if (!validPositiveNumber(body.plotWidthFt, 10000) || !validPositiveNumber(body.plotLengthFt, 10000)) {
    return 'Enter plot dimensions in feet (greater than 0 and at most 10,000).'
  }
  if (!validPositiveNumber(body.builtUpAreaSqft, 250000)) {
    return 'Enter a built-up area in square feet (greater than 0 and at most 250,000).'
  }
  if (!Number.isInteger(body.floors) || body.floors < 1 || body.floors > 5) {
    return 'Choose between 1 and 5 floors.'
  }
  if (!Number.isInteger(body.bedrooms) || body.bedrooms < 1 || body.bedrooms > 8) {
    return 'Choose between 1 and 8 bedrooms.'
  }
  if (body.budgetInr !== null && body.budgetInr !== undefined && (!Number.isInteger(body.budgetInr) || body.budgetInr < 100000 || body.budgetInr > 1000000000)) {
    return 'Budget must be between ₹1 lakh and ₹100 crore, or left blank.'
  }
  return null
}

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM home_profiles WHERE user_id = $1', [req.userId])
    return res.json({ profile: profileFromRow(result.rows[0]) })
  } catch (error) {
    return next(error)
  }
})

router.put('/', async (req, res, next) => {
  const validationError = validateProfile(req.body || {})
  if (validationError) return res.status(400).json({ error: validationError })

  const profile = req.body
  try {
    const result = await pool.query(
      `INSERT INTO home_profiles
        (user_id, city, plot_width_ft, plot_length_ft, built_up_area_sqft, floors, bedrooms, budget_inr)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id) DO UPDATE SET
         city = EXCLUDED.city,
         plot_width_ft = EXCLUDED.plot_width_ft,
         plot_length_ft = EXCLUDED.plot_length_ft,
         built_up_area_sqft = EXCLUDED.built_up_area_sqft,
         floors = EXCLUDED.floors,
         bedrooms = EXCLUDED.bedrooms,
         budget_inr = EXCLUDED.budget_inr,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        req.userId,
        profile.city.trim(),
        profile.plotWidthFt,
        profile.plotLengthFt,
        profile.builtUpAreaSqft,
        profile.floors,
        profile.bedrooms,
        profile.budgetInr ?? null,
      ],
    )
    return res.json({ profile: profileFromRow(result.rows[0]) })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
