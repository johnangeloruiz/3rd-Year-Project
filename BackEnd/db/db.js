/**
 * Database helper for MySQL
 * On startup, ensures the database and required tables exist
 */
const mysql = require('mysql');

const DB_NAME = process.env.DB_NAME || 'aiesdb';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST || 'localhost';

// Connect to MySQL without specifying a database
const baseConnection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
});

function ensureDatabaseAndTables() {
  return new Promise((resolve, reject) => {
    // 1. Create database if it doesn't exist
    baseConnection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, function(err) {
      if (err) return reject(err);
      // 2. Connect to the database
      const db = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        multipleStatements: true,
      });
      // 3. Create required tables if they don't exist
      const createTablesSQL = `
        CREATE TABLE IF NOT EXISTS accounts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstName VARCHAR(255),
          lastName VARCHAR(255),
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255),
          meetUpPlace VARCHAR(255),
          cellphoneNumber VARCHAR(32),
          selectedLocation VARCHAR(255)
        );
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          productName VARCHAR(255),
          productStock INT,
          productPrice FLOAT
        );
        CREATE TABLE IF NOT EXISTS cart (
          id INT AUTO_INCREMENT PRIMARY KEY,
          productName VARCHAR(255),
          productStock INT,
          productPrice FLOAT,
          totalPrice FLOAT,
          productQuantity INT,
          isCheckOut BOOLEAN,
          email VARCHAR(255)
        );
        CREATE TABLE IF NOT EXISTS sales (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstname VARCHAR(255),
          lastname VARCHAR(255),
          buyer VARCHAR(255),
          productName VARCHAR(255),
          productStock INT,
          cellphoneNumber VARCHAR(32),
          productPrice FLOAT,
          productQuantity INT,
          totalPrice FLOAT,
          meetUpPlace VARCHAR(255),
          typeOfPayment VARCHAR(255),
          selectedLocation VARCHAR(255),
          dateOfPurchase VARCHAR(32),
          shippingFee FLOAT,
          timeOfPurchase VARCHAR(32),
          adminApproval VARCHAR(32),
          newItem VARCHAR(32),
          dateOfDelivery VARCHAR(32)
        );
        CREATE TABLE IF NOT EXISTS contactus (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstName VARCHAR(255),
          lastName VARCHAR(255),
          email VARCHAR(255),
          cellphoneNumber VARCHAR(32),
          subject VARCHAR(255),
          message TEXT,
          dateOfMessage VARCHAR(32),
          timeOfmessage VARCHAR(32)
        );
      `;
      db.query(createTablesSQL, (err) => {
        if (err) return reject(err);
        resolve(db);
      });
    });
  });
}

// On startup, ensure DB and tables exist, then export queryDatabase
let db;
const ready = ensureDatabaseAndTables().then((connection) => {
  db = connection;
});

const queryDatabase = (sql, values) => {
  return new Promise((resolve, reject) => {
    ready.then(() => {
      db.query(sql, values, (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    }).catch(reject);
  });
};

module.exports = { db, queryDatabase }; 