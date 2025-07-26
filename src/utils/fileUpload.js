// File Upload Error Handling Utilities
const multer = require('multer');
const path = require('path');

// Custom error class for file upload errors
class FileUploadError extends Error {
  constructor(message, code, statusCode = 400) {
    super(message);
    this.name = 'FileUploadError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// File filter function
const fileFilter = (req, file, cb) => {
  try {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new FileUploadError(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
        'INVALID_FILE_TYPE'
      ), false);
    }
  } catch (error) {
    cb(new FileUploadError(
      'Error processing file type validation',
      'FILE_VALIDATION_ERROR'
    ), false);
  }
};

// Storage configuration with error handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadPath = path.join(__dirname, '../uploads/images');
      cb(null, uploadPath);
    } catch (error) {
      cb(new FileUploadError(
        'Failed to set upload destination',
        'DESTINATION_ERROR'
      ));
    }
  },
  
  filename: (req, file, cb) => {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      const filename = file.fieldname + '-' + uniqueSuffix + extension;
      cb(null, filename);
    } catch (error) {
      cb(new FileUploadError(
        'Failed to generate filename',
        'FILENAME_ERROR'
      ));
    }
  }
});

// Multer configuration with comprehensive error handling
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  }
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB.',
          code: 'FILE_TOO_LARGE'
        });
        
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 10 files allowed.',
          code: 'TOO_MANY_FILES'
        });
        
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected file field.',
          code: 'UNEXPECTED_FILE'
        });
        
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + err.message,
          code: 'UPLOAD_ERROR'
        });
    }
  }
  
  if (err instanceof FileUploadError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code
    });
  }
  
  // Generic error handling
  console.error('Upload error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error during file upload',
    code: 'INTERNAL_ERROR'
  });
};

// Utility function to validate uploaded files
const validateUploadedFiles = (files) => {
  if (!files || files.length === 0) {
    throw new FileUploadError(
      'No files uploaded',
      'NO_FILES'
    );
  }

  files.forEach((file, index) => {
    if (!file.filename || !file.path) {
      throw new FileUploadError(
        \Invalid file at index \\,
        'INVALID_FILE'
      );
    }
  });

  return true;
};

module.exports = {
  upload,
  handleUploadError,
  validateUploadedFiles,
  FileUploadError
};
