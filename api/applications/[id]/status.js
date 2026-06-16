const { verifyToken } = require('../../_auth');
const getPool = require('../../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
  if (decoded.role !== 'recruiter') return res.status(403).json({ message: 'Forbidden' });

  const { id } = req.query;
  const { status } = req.body;

  const validStatuses = ['pending', 'shortlisted', 'rejected'];
  if (!status || !validStatuses.includes(status))
    return res.status(400).json({ message: 'Status must be pending, shortlisted, or rejected' });

  try {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT a.*, j.recruiter_id FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Application not found' });
    if (rows[0].recruiter_id !== decoded.id)
      return res.status(403).json({ message: 'You can only update applications for your own jobs' });

    await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);

    const [updated] = await db.query(
      `SELECT a.*, u.name AS seeker_name, u.email AS seeker_email, j.title AS job_title
       FROM applications a
       JOIN users u ON a.seeker_id = u.id
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ?`,
      [id]
    );
    res.json(updated[0]);
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
