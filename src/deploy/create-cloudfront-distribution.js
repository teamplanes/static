// @flow
import fp from 'lodash/fp';
import sdk from './sdk';
import getDistributionConfig from './get-distribution-config';
import type { BucketType, CDNType } from './types';

const findExistingDistribution = async (
  bucket: BucketType,
  nextMarker?: string,
) => {
  const { DistributionList: list } = await sdk.cloudfront
    .listDistributions({ MaxItems: '100', Marker: nextMarker })
    .promise();
  const existing = fp.find(
    item =>
      fp.find(
        // HACK: Is there a better way to associaste distributions with buckets?
        origin => fp.startsWith(`${bucket.name}.s3`, origin.DomainName),
        item.Origins.Items,
      ),
    list.Items,
  );
  if (list.IsTruncated && !existing) {
    return findExistingDistribution(bucket, list.NextMarker);
  }
  return existing;
};

const createNewInvalidationForDistribution = async (distributionId: string) => {
  const params = {
    DistributionId: distributionId,
    InvalidationBatch: {
      CallerReference: new Date().toString(),
      Paths: {
        Quantity: 1,
        // TODO: this could be smarter and not invalidate everything.
        Items: ['/*'],
      },
    },
  };
  await sdk.cloudfront.createInvalidation(params).promise();
};

export default async (bucket: BucketType): Promise<CDNType> => {
  const existingDistribution = await findExistingDistribution(bucket);
  const config = getDistributionConfig(bucket);

  if (existingDistribution) {
    await createNewInvalidationForDistribution(existingDistribution.Id);
    // TODO: Update/validate the distribution config here.
    return {
      url: existingDistribution.DomainName,
      distributionId: existingDistribution.Id,
      isNew: false,
    };
  }

  const { Distribution: dist } = await sdk.cloudfront
    .createDistribution(config)
    .promise();
  return {
    url: dist.DomainName,
    distributionId: dist.Id,
    isNew: true,
  };
};
