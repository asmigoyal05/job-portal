const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// POST /api/applications - seeker applies
router.post('/', authMiddleware, requireRole('seeker'), applyForJob);

// GET /api/applications/mine - seeker's own applications
router.get('/mine', authMiddleware, requireRole('seeker'), getMyApplications);

// GET /api/applications/job/:jobId - recruiter views applicants for a job
router.get('/job/:jobId', authMiddleware, requireRole('recruiter'), getJobApplicants);

// PUT /api/applications/:id/status - recruiter updates status
router.put('/:id/status', authMiddleware, requireRole('recruiter'), updateApplicationStatus);

module.exports = router;
