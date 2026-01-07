const cloudinary = require('../config/cloudinary');
const Design = require('../models/Design');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images and design files
  const allowedTypes = /jpeg|jpg|png|gif|pdf|ai|psd|svg|eps/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and design files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

// @desc    Upload file to Cloudinary
// @route   POST /api/uploads
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary using buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sri-senthil-printing',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    // Save design info to database
    const design = await Design.create({
      user: req.user._id,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      cloudinaryId: result.public_id,
      description: req.body.description || '',
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        url: result.secure_url,
        publicId: result.public_id,
        design: design,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's uploaded designs
// @route   GET /api/uploads/mydesigns
// @access  Private
exports.getMyDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete uploaded design
// @route   DELETE /api/uploads/:id
// @access  Private
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Check if user owns the design or is admin
    if (design.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this design' });
    }

    // Delete from Cloudinary
    if (design.cloudinaryId) {
      await cloudinary.uploader.destroy(design.cloudinaryId);
    }

    // Delete from database
    await design.deleteOne();

    res.json({ message: 'Design removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export multer upload middleware
exports.uploadMiddleware = upload.single('file');