// @flow
import type { BucketType } from './types';

module.exports = (bucket: BucketType) => ({
  DistributionConfig: {
    Comment: '',
    CacheBehaviors: {
      Quantity: 0,
    },
    Logging: {
      Bucket: '',
      Prefix: '',
      Enabled: false,
      IncludeCookies: false,
    },
    Origins: {
      Items: [
        {
          OriginPath: '',
          CustomOriginConfig: {
            OriginProtocolPolicy: 'http-only',
            HTTPPort: 80,
            HTTPSPort: 443,
          },
          Id: `S3-Website-${bucket.url}`,
          DomainName: `${bucket.url}`,
        },
      ],
      Quantity: 1,
    },
    DefaultRootObject: bucket.isClientSideRouted ? '200' : 'index',
    PriceClass: 'PriceClass_All',
    Enabled: true,
    DefaultCacheBehavior: {
      TrustedSigners: {
        Enabled: false,
        Quantity: 0,
      },
      TargetOriginId: `S3-Website-${bucket.url}`,
      ViewerProtocolPolicy: 'redirect-to-https',
      ForwardedValues: {
        Headers: {
          Quantity: 0,
        },
        Cookies: {
          Forward: 'none',
        },
        QueryString: false,
      },
      MaxTTL: 31536000,
      SmoothStreaming: false,
      DefaultTTL: 86400,
      AllowedMethods: {
        Items: ['HEAD', 'GET'],
        CachedMethods: {
          Items: ['HEAD', 'GET'],
          Quantity: 2,
        },
        Quantity: 2,
      },
      MinTTL: 0,
    },
    CallerReference: new Date().toString(),
    ViewerCertificate: {
      CloudFrontDefaultCertificate: true,
      MinimumProtocolVersion: 'TLSv1',
    },
    CustomErrorResponses: {
      Items: [
        {
          ErrorCachingMinTTL: 300,
          ErrorCode: '404',
          ResponseCode: bucket.isClientSideRouted ? '200' : '404',
          ResponsePagePath: bucket.isClientSideRouted ? '/200' : '/404',
        },
      ],
      Quantity: 1,
    },
    Restrictions: {
      GeoRestriction: {
        RestrictionType: 'none',
        Quantity: 0,
      },
    },
    Aliases: {
      Quantity: 0,
    },
  },
});
