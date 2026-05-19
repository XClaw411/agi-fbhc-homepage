/**
 * MySQL Database Connection Pool
 * Uses mysql2 for async/await support
 */

const mysql = require('mysql2/promise');

// Database configuration from environment variables
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agi_fbhc_homepage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
};

// Create connection pool
let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(DB_CONFIG);
    console.log(`[DB] Pool created for ${DB_CONFIG.database}@${DB_CONFIG.host}`);
  }
  return pool;
}

/**
 * Execute a SQL query with parameters
 */
async function query(sql, params = []) {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

/**
 * Execute a transaction
 */
async function transaction(queries) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const results = [];
    for (const { sql, params } of queries) {
      const [rows] = await connection.execute(sql, params || []);
      results.push(rows);
    }
    await connection.commit();
    return results;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Test database connection
 */
async function testConnection() {
  try {
    const rows = await query('SELECT 1 as test');
    console.log('[DB] ✓ Connection OK');
    return true;
  } catch (err) {
    console.error('[DB] ✗ Connection failed:', err.message);
    return false;
  }
}

/**
 * Close pool (for graceful shutdown)
 */
async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('[DB] Pool closed');
  }
}

module.exports = {
  query,
  transaction,
  testConnection,
  closePool,
  getPool,
};
