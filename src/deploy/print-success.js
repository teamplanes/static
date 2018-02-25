// @flow
import prettyjson from 'prettyjson';
import type { BucketType, ArgsType, CDNType } from './types';

const padder = ' '.repeat(4);

export default (args: ArgsType, bucket: BucketType, cdn: CDNType) => {
  // eslint-disable-next-line no-console
  console.log();
  // eslint-disable-next-line no-console
  console.log(`${padder}🎉  Successfully published your static site!`);
  // eslint-disable-next-line no-console
  console.log(
    prettyjson.render(
      {
        Domain: args.domain,
        Directory: args.directory,
        'S3 Endpoint': `http://${bucket.url}`,
        'CDN Domain': `https://${cdn.url}`,
        'Client Routing': bucket.isClientSideRouted ? 'Enabled' : 'Disabled',
      },
      {
        keysColor: 'grey',
      },
      4,
    ),
  );
  // eslint-disable-next-line no-console
  console.log();
  if (cdn.isNew) {
    // eslint-disable-next-line no-console
    console.log(
      '⏳  NOTE: CloudFront distribution updates can take a while to create, \n' +
        '20 minutes+ in some cases. You can check progress here: \n' +
        'https://console.aws.amazon.com/cloudfront/home',
    );
  } else {
    // eslint-disable-next-line no-console
    console.log(
      '⏳  NOTE: An invalidation was created to update the CDN cache \n' +
        'for your site, only once this process is complete will  \n' +
        'you see your changes, you can check on progress here \n' +
        "under the 'Invalidations' tab: \n" +
        `https://console.aws.amazon.com/cloudfront/home#distribution-settings:${
          cdn.distributionId
        }`,
    );
  }
  // eslint-disable-next-line no-console
  console.log();
};
