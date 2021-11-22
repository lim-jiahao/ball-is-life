import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  user: 'limjiahao',
  host: 'localhost',
  database: 'ball_is_life',
  port: 5432,
});

export default pool;
