/**
 * Auth Controller
 * Handles authentication business logic
 */
const bcrypt = require('bcrypt');
const { queryDatabase } = require('../db/db');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = 'INSERT INTO accounts (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
    const values = [firstName, lastName, email, hashedPassword];
    await queryDatabase(insertQuery, values);
    res.status(201).json({ success: true, status: 'Success' });
  } catch (error) {
    console.error('Error during registration:', error);
    next(error);
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const sql = 'SELECT * FROM accounts WHERE email = ?';
    const data = await queryDatabase(sql, [req.body.email]);
    if (data.length > 0) {
      const storedPassword = data[0].password;
      const enteredPassword = req.body.password;
      const passwordMatch = await bcrypt.compare(enteredPassword, storedPassword);
      if (passwordMatch) {
        return res.json({ success: true, status: 'Success' });
      } else {
        return res.status(401).json({ success: false, error: 'Password does not match.' });
      }
    } else {
      return res.status(404).json({ success: false, error: 'No account with that email.' });
    }
  } catch (error) {
    console.error('Login route error:', error);
    next(error);
  }
}; 