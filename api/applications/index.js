const { verifyToken } = require('../_auth');
const getPool = require('../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
  if (decoded.role !== 'seeker') return res.status(403).json({ message: 'Only job seekers can apply' });

  const { job_id } = req.body;
  if (!job_id) return res.status(400).json({ message: 'Job ID is required' });

  try {
    const db = getPool();

    const [job] = await db.query('SELECT id FROM jobs WHERE id = ?', [job_id]);
    if (job.length === 0) return res.status(404).json({ message: 'Job not found' });

    const [existing] = await db.query(
      'SELECT id FROM applications WHERE job_id = ? AND seeker_id = ?',
      [job_id, decoded.id]
    );
    if (existing.length > 0)
      return res.status(409).json({ message: 'You have already applied for this job' });

    const [result] = await db.query(
      'INSERT INTO applications (job_id, seeker_id) VALUES (?, ?)',
      [job_id, decoded.id]
    );

    const [rows] = await db.query(
      `SELECT a.*, j.title AS job_title, j.company
       FROM applications a JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ?`,
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'You have already applied for this job' });
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Server error submitting application' });
  }
};
