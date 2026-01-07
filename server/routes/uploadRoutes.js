const express = require('express');
const router = express.Router();
const {
  uploadFile,
  getMyDesigns,
  deleteDesign,
  uploadMiddleware,
} = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, uploadMiddleware, uploadFile);
router.get('/mydesigns', protect, getMyDesigns);
router.delete('/:id', protect, deleteDesign);

module.exports = router;