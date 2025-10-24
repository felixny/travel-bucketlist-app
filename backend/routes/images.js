const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { generatePresignedUrl } = require('../config/aws');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateUser);

// POST /api/images/presigned-url - Generate pre-signed URL for image upload
router.post('/presigned-url', async (req, res) => {
  try {
    const { contentType, fileName } = req.body;

    if (!contentType || !fileName) {
      return res.status(400).json({ 
        error: 'Content type and file name are required' 
      });
    }

    // Validate content type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({ 
        error: 'Invalid content type. Only JPEG, PNG, WebP, and GIF are allowed' 
      });
    }

    // Generate unique key for the image
    const fileExtension = fileName.split('.').pop();
    const uniqueKey = `destinations/${req.user.id}/${uuidv4()}.${fileExtension}`;

    // Generate pre-signed URL
    const presignedUrl = generatePresignedUrl(uniqueKey, contentType);

    res.json({
      presignedUrl,
      key: uniqueKey,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});

// POST /api/images/upload - Upload image directly (alternative to presigned URL)
router.post('/upload', async (req, res) => {
  try {
    // This endpoint would handle direct uploads if needed
    // For now, we'll use presigned URLs for better security
    res.status(501).json({ 
      error: 'Direct upload not implemented. Use presigned URL endpoint instead.' 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
