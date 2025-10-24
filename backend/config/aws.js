const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const generatePresignedUrl = (key, contentType) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    Expires: 60 * 5 // 5 minutes
  };

  return s3.getSignedUrl('putObject', params);
};

const deleteObject = (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key
  };

  return s3.deleteObject(params).promise();
};

module.exports = {
  s3,
  generatePresignedUrl,
  deleteObject
};
