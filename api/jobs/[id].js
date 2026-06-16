const { verifyToken } = require('../_auth');
const getPool = require('../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const db = getPool();

  // GET /api/jobs/:id
  if (req.method === 'GET') {
    try {
      const [rows] = await db.query(
        `SELECT j.*, u.name AS recruiter_name, u.email AS recruiter_email
         FROM jobs j JOIN users u ON j.recruiter_id = u.id
         WHERE j.id = ?`,
        [id]
      );
      if (rows.length === 0)
        return res.status(404).json({ message: 'Job not found' });
      return res.json(rows[0]);
    } catch (err) {
      console.error('Get job error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // PUT /api/jobs/:id — recruiter (owner) only
  if (req.method === 'PUT') {
    const decoded = verifyToken(req);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
    if (decoded.role !== 'recruiter') return res.status(403).json({ message: 'Forbidden' });

    try {
      const [existing] = await db.query('SELECT * FROM jobs WHERE id = ?', [id]);
      if (existing.length === 0) return res.status(404).json({ message: 'Job not found' });
      if (existing[0].recruiter_id !== decoded.id)
        return res.status(403).json({ message: 'You can only edit your own jobs' });

      const { title, company, location, salary, type, description, requirements } = req.body;
      const validTypes = ['full-time', 'part-time', 'remote', 'internship'];
      if (type && !validTypes.includes(type))
        return res.status(400).json({ message: 'Invalid job type' });

      await db.query(
        `UPDATE jobs SET title=?, company=?, location=?, salary=?, type=?, description=?, requirements=? WHERE id=?`,
        [
          title || existing[0].title,
          company || existing[0].company,
          location !== undefined ? location : existing[0].location,
          salary !== undefined ? salary : existing[0].salary,
          type || existing[0].type,
          description !== undefined ? description : existing[0].description,
          requirements !== undefined ? requirements : existing[0].requirements,
          id,
        ]
      );
      const [updated] = await db.query('SELECT * FROM jobs WHERE id = ?', [id]);
      return res.json(updated[0]);
    } catch (err) {
      console.error('Update job error:', err);
      return res.status(500).json({ message: 'Server error updating job' });
    }
  }

  // DELETE /api/jobs/:id — recruiter (owner) only
  if (req.method === 'DELETE') {
    const decoded = verifyToken(req);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
    if (decoded.role !== 'recruiter') return res.status(403).json({ message: 'Forbidden' });

    try {
      const [existing] = await db.query('SELECT * FROM jobs WHERE id = ?', [id]);
      if (existing.length === 0) return res.status(404).json({ message: 'Job not found' });
      if (existing[0].recruiter_id !== decoded.id)
        return res.status(403).json({ message: 'You can only delete your own jobs' });

      await db.query('DELETE FROM jobs WHERE id = ?', [id]);
      return res.json({ message: 'Job deleted successfully' });
    } catch (err) {
      console.error('Delete job error:', err);
      return res.status(500).json({ message: 'Server error deleting job' });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
};
