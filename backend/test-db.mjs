import { pool } from './db.mjs';


const result = await pool.query('SELECT * FROM products');
console.log(result.rows);

await pool.end();