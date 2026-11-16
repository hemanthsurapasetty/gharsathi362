const { Pool } = require('pg')

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Copy backend/.env.example to backend/.env and configure PostgreSQL.')
}

const ssl = process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl })

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message)
})

module.exports = { pool }
