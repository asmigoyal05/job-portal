const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

const initializeDatabase = async () => {
  try {
    // Create database if not exists
    await promisePool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'job_portal'}\``);
    await promisePool.query(`USE \`${process.env.DB_NAME || 'job_portal'}\``);

    // Users table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('seeker', 'recruiter') NOT NULL,
        avatar VARCHAR(10) DEFAULT NULL,
        bio TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Jobs table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recruiter_id INT NOT NULL,
        title VARCHAR(150) NOT NULL,
        company VARCHAR(100) NOT NULL,
        location VARCHAR(100),
        salary VARCHAR(50),
        type ENUM('full-time', 'part-time', 'remote', 'internship') DEFAULT 'full-time',
        description TEXT,
        requirements TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Applications table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        seeker_id INT NOT NULL,
        status ENUM('pending', 'shortlisted', 'rejected') DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_application (job_id, seeker_id)
      )
    `);

    console.log('✅ Database & tables ready');
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    process.exit(1);
  }
};

// Re-create pool with DB name after init
const getPool = () => {
  const dbPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'job_portal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  return dbPool.promise();
};

module.exports = { initializeDatabase, getPool };
