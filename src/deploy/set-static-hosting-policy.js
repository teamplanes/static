// @flow
import fp from 'lodash/fp';
import type { BucketType } from './types';
import sdk from './sdk';

const getPublicReadPolicyForBucket = (bucket: BucketType) => ({
  Sid: 'AddPublicReadPermissions',
  Effect: 'Allow',
  Principal: '*',
  Action: 's3:GetObject',
  Resource: `arn:aws:s3:::${bucket.name}/*`,
});

const getBucketPolicy = async (bucket: BucketType) => {
  let policy;
  try {
    const data = await sdk.s3
      .getBucketPolicy({ Bucket: bucket.name })
      .promise();
    policy = JSON.parse(data.Policy);
  } catch (e) {
    if (e.code === 'NoSuchBucketPolicy') {
      policy = { Statement: [] };
    } else {
      throw e;
    }
  }
  policy.Statement = fp.flow([
    fp.filter(state => state.Sid !== 'AddPublicReadPermissions'),
    fp.concat([getPublicReadPolicyForBucket(bucket)]),
  ])(policy.Statement);
  return policy;
};

const saveBucketPolicy = async (bucket, policy) => {
  await sdk.s3
    .putBucketPolicy({ Bucket: bucket.name, Policy: JSON.stringify(policy) })
    .promise();
};

const createStaticSitePolicyForBucket = async (bucket: BucketType) => {
  const policy = {
    Bucket: bucket.name,
    WebsiteConfiguration: {
      IndexDocument: {
        Suffix: bucket.isClientSideRouted ? '200' : 'index',
      },
      ErrorDocument: {
        Key: 'error.html',
      },
    },
  };
  await sdk.s3.putBucketWebsite(policy).promise();
};

export default async (bucket: BucketType) => {
  const policy = await getBucketPolicy(bucket);
  await saveBucketPolicy(bucket, policy);
  await createStaticSitePolicyForBucket(bucket);
};
