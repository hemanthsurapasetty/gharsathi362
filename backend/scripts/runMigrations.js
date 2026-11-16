require('dotenv').config()

const fs = require('node:fs/promises')
const path = require('node:path')
const { Pool } = require('pg')

async function run() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required to run migrations.')
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  })

  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
    const directory = path.join(__dirname, '..', 'migrations')
    const files = (await fs.readdir(directory)).filter((file) => file.endsWith('.sql')).sort()

    for (const name of files) {
      const alreadyApplied = await pool.query('SELECT 1 FROM schema_migrations WHERE name = $1', [name])
      if (alreadyApplied.rowCount) continue

      const sql = await fs.readFile(path.join(directory, name), 'utf8')
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        await client.query(sql)
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name])
        await client.query('COMMIT')
        console.log(`Applied ${name}`)
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
      }
    }
  } finally {
    await pool.end()
  }
}

run().catch((error) => {
  console.error('Migration failed:', error.message)
  process.exitCode = 1
})
