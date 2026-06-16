const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
} = require('../controllers/jobController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// GET /api/jobs - public, supports ?search=
router.get('/', getAllJobs);

// GET /api/jobs/recruiter/mine - recruiter's own jobs (must come before /:id)
router.get('/recruiter/mine', authMiddleware, requireRole('recruiter'), getRecruiterJobs);

// GET /api/jobs/:id - public
router.get('/:id', getJobById);

// POST /api/jobs - recruiter only
router.post('/', authMiddleware, requireRole('recruiter'), createJob);

// PUT /api/jobs/:id - recruiter only (owner)
router.put('/:id', authMiddleware, requireRole('recruiter'), updateJob);

// DELETE /api/jobs/:id - recruiter only (owner)
router.delete('/:id', authMiddleware, requireRole('recruiter'), deleteJob);

module.exports = router;
