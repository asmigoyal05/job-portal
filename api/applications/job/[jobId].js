const { verifyToken } = require('../../_auth');
const getPool = require('../../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
  if (decoded.role !== 'recruiter') return res.status(403).json({ message: 'Forbidden' });

  const { jobId } = req.query;

  try {
    const db = getPool();
    const [job] = await db.query('SELECT recruiter_id, title, company FROM jobs WHERE id = ?', [jobId]);
    if (job.length === 0) return res.status(404).json({ message: 'Job not found' });
    if (job[0].recruiter_id !== decoded.id)
      return res.status(403).json({ message: 'You can only view applicants for your own jobs' });

    const [rows] = await db.query(
      `SELECT a.id, a.status, a.applied_at,
              u.id AS seeker_id, u.name AS seeker_name, u.email AS seeker_email,
              j.title AS job_title, j.company
       FROM applications a
       JOIN users u ON a.seeker_id = u.id
       JOIN jobs j ON a.job_id = j.id
       WHERE a.job_id = ?
       ORDER BY a.applied_at DESC`,
      [jobId]
    );
    res.json({ job: job[0], applicants: rows });
  } catch (err) {
    console.error('Get applicants error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
