import AWS from 'aws-sdk';

export default {
  s3: new AWS.S3(),
  cloudfront: new AWS.CloudFront(),
};
