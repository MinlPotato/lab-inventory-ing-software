const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


const pool = mysql.createPool({
  host: process.env.HOST || 'localhost',
  user: process.env.USER || 'myuser',
  password: process.env.DATABASE_PASSWORD || 'mypassword',
  database: process.env.DATABASE || 'myapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDb() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const sampleProducts = [
    ['Laptop Pro', 'Electronics', 15, 1299.99, 'High-performance laptop'],
    ['Wireless Mouse', 'Electronics', 45, 29.99, 'Ergonomic wireless mouse'],
    ['Office Chair', 'Furniture', 8, 199.99, 'Comfortable office chair'],
    ['Coffee Beans', 'Food', 120, 12.99, 'Premium coffee beans'],
    ['Notebook Set', 'Office Supplies', 200, 8.99, 'Pack of 3 notebooks']
  ];

  const conn = await pool.getConnection();
  try {
    await conn.query(createTableSQL);

    const [rows] = await conn.query('SELECT COUNT(*) AS count FROM products');
    if (rows[0].count === 0) {
      await conn.query(
        'INSERT INTO products (name, category, quantity, price, description) VALUES ?',
        [sampleProducts]
      );
      console.log('Sample products inserted.');
    }
  } finally {
    conn.release();
  }
}
initDb().catch(console.error);

// API ROUTES
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [
      req.params.id
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  if (!name || !category || quantity === undefined || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?)',
      [name, category, quantity, price, description]
    );
    res.json({ id: result.insertId, message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE products SET name=?, category=?, quantity=?, price=?, description=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
      [name, category, quantity, price, description, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [
      req.params.id
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) AS total_products,
        SUM(quantity) AS total_items,
        COUNT(DISTINCT category) AS categories,
        SUM(quantity * price) AS total_value
      FROM products
    `);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});