const { getPool } = require('../config/db');

const getAllJobs = async (req, res) => {
  const { search, type } = req.query;
  try {
    const db = getPool();
    let query = `SELECT j.*, u.name AS recruiter_name FROM jobs j JOIN users u ON j.recruiter_id = u.id`;
    const params = [];
    const conditions = [];
    if (search) {
      conditions.push('(j.title LIKE ? OR j.company LIKE ? OR j.location LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (type && type !== 'all') {
      conditions.push('j.type = ?');
      params.push(type);
    }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY j.created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Get jobs error:', err);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
};

const getJobById = async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT j.*, u.name AS recruiter_name, u.email AS recruiter_email
       FROM jobs j JOIN users u ON j.recruiter_id = u.id WHERE j.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Job not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createJob = async (req, res) => {
  const { title, company, location, salary, type, description, requirements } = req.body;
  if (!title || !company) return res.status(400).json({ message: 'Title and company are required' });
  const validTypes = ['full-time', 'part-time', 'remote', 'internship'];
  if (type && !validTypes.includes(type)) return res.status(400).json({ message: 'Invalid job type' });
  try {
    const db = getPool();
    const [result] = await db.query(
      `INSERT INTO jobs (recruiter_id, title, company, location, salary, type, description, requirements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, company, location || null, salary || null, type || 'full-time', description || null, requirements || null]
    );
    const [rows] = await db.query('SELECT * FROM jobs WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ message: 'Server error creating job' });
  }
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  try {
    const db = getPool();
    const [existing] = await db.query('SELECT * FROM jobs WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Job not found' });
    if (existing[0].recruiter_id !== req.user.id) return res.status(403).json({ message: 'Not your job' });
    const { title, company, location, salary, type, description, requirements } = req.body;
    await db.query(
      `UPDATE jobs SET title=?, company=?, location=?, salary=?, type=?, description=?, requirements=? WHERE id=?`,
      [title || existing[0].title, company || existing[0].company,
       location !== undefined ? location : existing[0].location,
       salary !== undefined ? salary : existing[0].salary,
       type || existing[0].type,
       description !== undefined ? description : existing[0].description,
       requirements !== undefined ? requirements : existing[0].requirements,
       id]
    );
    const [updated] = await db.query('SELECT * FROM jobs WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const db = getPool();
    const [existing] = await db.query('SELECT * FROM jobs WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Job not found' });
    if (existing[0].recruiter_id !== req.user.id) return res.status(403).json({ message: 'Not your job' });
    await db.query('DELETE FROM jobs WHERE id = ?', [id]);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecruiterJobs = async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS applicant_count
       FROM jobs j WHERE j.recruiter_id = ? ORDER BY j.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob, getRecruiterJobs };
