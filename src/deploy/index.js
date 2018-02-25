// @flow
import ora from 'ora';
import createCloudfrontDistribution from './create-cloudfront-distribution';
import deployS3 from './deploy-s3';
import setStaticHostingPolicy from './set-static-hosting-policy';
import type { ArgsType } from './types';
import printSuccess from './print-success';

export default async (args: ArgsType) => {
  const uploadSpinner = ora(`Uploading your directory to S3`).start();
  const bucket = await deployS3(args.directory, args.domain);
  uploadSpinner.succeed(`Uploaded the contents to S3`);

  const policySpinner = ora('Turning ON static website hosting').start();
  await setStaticHostingPolicy(bucket);
  policySpinner.succeed(`Static hosting ON for S3 bucket`);

  const cloudFrontSpinner = ora('Setting up a CDN via CloudFront').start();
  const cdn = await createCloudfrontDistribution(bucket);
  cloudFrontSpinner.succeed('CDN via CloudFront setup');
  printSuccess(args, bucket, cdn);
};
