const { verifyToken } = require('../_auth');
const getPool = require('../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
  if (decoded.role !== 'recruiter') return res.status(403).json({ message: 'Forbidden' });

  try {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT j.*,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS applicant_count
       FROM jobs j
       WHERE j.recruiter_id = ?
       ORDER BY j.created_at DESC`,
      [decoded.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get recruiter jobs error:', err);
    res.status(500).json({ message: 'Server error fetching your jobs' });
  }
};
