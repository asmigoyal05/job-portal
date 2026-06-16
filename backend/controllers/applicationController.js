const { getPool } = require('../config/db');

const applyForJob = async (req, res) => {
  const { job_id } = req.body;
  if (!job_id) return res.status(400).json({ message: 'Job ID is required' });
  try {
    const db = getPool();
    const [job] = await db.query('SELECT id FROM jobs WHERE id = ?', [job_id]);
    if (job.length === 0) return res.status(404).json({ message: 'Job not found' });
    const [existing] = await db.query(
      'SELECT id FROM applications WHERE job_id = ? AND seeker_id = ?',
      [job_id, req.user.id]
    );
    if (existing.length > 0) return res.status(409).json({ message: 'You have already applied for this job' });
    const [result] = await db.query(
      'INSERT INTO applications (job_id, seeker_id) VALUES (?, ?)',
      [job_id, req.user.id]
    );
    const [rows] = await db.query(
      `SELECT a.*, j.title AS job_title, j.company FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = ?`,
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Already applied' });
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT a.id, a.status, a.applied_at,
              j.id AS job_id, j.title AS job_title, j.company, j.location, j.type, j.salary
       FROM applications a JOIN jobs j ON a.job_id = j.id
       WHERE a.seeker_id = ? ORDER BY a.applied_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getJobApplicants = async (req, res) => {
  const { jobId } = req.params;
  try {
    const db = getPool();
    const [job] = await db.query('SELECT recruiter_id, title, company FROM jobs WHERE id = ?', [jobId]);
    if (job.length === 0) return res.status(404).json({ message: 'Job not found' });
    if (job[0].recruiter_id !== req.user.id) return res.status(403).json({ message: 'Not your job' });
    const [rows] = await db.query(
      `SELECT a.id, a.status, a.applied_at,
              u.id AS seeker_id, u.name AS seeker_name, u.email AS seeker_email,
              j.title AS job_title, j.company
       FROM applications a JOIN users u ON a.seeker_id = u.id JOIN jobs j ON a.job_id = j.id
       WHERE a.job_id = ? ORDER BY a.applied_at DESC`,
      [jobId]
    );
    res.json({ job: job[0], applicants: rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'shortlisted', 'rejected'].includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  try {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT a.*, j.recruiter_id FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Application not found' });
    if (rows[0].recruiter_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
    const [updated] = await db.query(
      `SELECT a.*, u.name AS seeker_name, u.email AS seeker_email, j.title AS job_title
       FROM applications a JOIN users u ON a.seeker_id = u.id JOIN jobs j ON a.job_id = j.id WHERE a.id = ?`,
      [id]
    );
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { applyForJob, getMyApplications, getJobApplicants, updateApplicationStatus };
