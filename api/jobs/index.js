const { verifyToken } = require('../_auth');
const getPool = require('../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getPool();

  // GET /api/jobs — public, list all jobs with optional search
  if (req.method === 'GET') {
    const { search, type } = req.query;
    try {
      let query = `
        SELECT j.*, u.name AS recruiter_name
        FROM jobs j
        JOIN users u ON j.recruiter_id = u.id
      `;
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
      if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
      query += ' ORDER BY j.created_at DESC';

      const [rows] = await db.query(query, params);
      return res.json(rows);
    } catch (err) {
      console.error('Get jobs error:', err);
      return res.status(500).json({ message: 'Server error fetching jobs' });
    }
  }

  // POST /api/jobs — recruiter only
  if (req.method === 'POST') {
    const decoded = verifyToken(req);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
    if (decoded.role !== 'recruiter') return res.status(403).json({ message: 'Only recruiters can post jobs' });

    const { title, company, location, salary, type, description, requirements } = req.body;
    if (!title || !company)
      return res.status(400).json({ message: 'Title and company are required' });

    const validTypes = ['full-time', 'part-time', 'remote', 'internship'];
    if (type && !validTypes.includes(type))
      return res.status(400).json({ message: 'Invalid job type' });

    try {
      const [result] = await db.query(
        `INSERT INTO jobs (recruiter_id, title, company, location, salary, type, description, requirements)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [decoded.id, title, company, location || null, salary || null, type || 'full-time', description || null, requirements || null]
      );
      const [rows] = await db.query('SELECT * FROM jobs WHERE id = ?', [result.insertId]);
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('Create job error:', err);
      return res.status(500).json({ message: 'Server error creating job' });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
};
