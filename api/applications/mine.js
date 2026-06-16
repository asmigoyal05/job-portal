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
  if (decoded.role !== 'seeker') return res.status(403).json({ message: 'Forbidden' });

  try {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT a.id, a.status, a.applied_at,
              j.id AS job_id, j.title AS job_title, j.company, j.location, j.type, j.salary
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.seeker_id = ?
       ORDER BY a.applied_at DESC`,
      [decoded.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get my applications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
