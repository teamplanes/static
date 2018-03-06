// @flow
import fs from 'fs';
import path from 'path';
import fp from 'lodash/fp';
import mime from 'mime-types';
import sdk from './sdk';
import type { BucketType } from './types';

const getBucketRegion = async bucket => {
  const location = await sdk.s3.getBucketLocation({ Bucket: bucket }).promise();
  return location.LocationConstraint || 'us-east-1';
};

const getBuckets = async () => {
  const { Buckets: buckets } = await sdk.s3.listBuckets().promise();
  return buckets;
};

const createNewBucket = async domain => {
  const params = { Bucket: domain };
  await sdk.s3.createBucket(params).promise();
  return domain;
};

const clearBucket = async bucket => {
  const bucketObjects = await sdk.s3.listObjects({ Bucket: bucket }).promise();
  // For all of the 'objects' in the bucket, delete them.
  await Promise.all(
    bucketObjects.Contents.map(obj =>
      sdk.s3.deleteObject({ Bucket: bucket, Key: obj.Key }).promise(),
    ),
  );
};

const uploadDirectoryContents = async (
  bucket,
  currentDirectory,
  contents,
  siteBaseDir = currentDirectory,
) => {
  await Promise.all(
    contents.map(async fileName => {
      // Build the file path from the current file path and file name.
      const filePath = path.resolve(currentDirectory, fileName);
      const fileKey = path.relative(siteBaseDir, filePath);
      // If its a directory, dig deeper
      if (fs.statSync(filePath).isDirectory()) {
        return uploadDirectoryContents(
          bucket,
          filePath,
          fs.readdirSync(filePath),
          siteBaseDir,
        );
      }
      const mimeType = mime.lookup(filePath);

      // If its not a directory, upload.
      const params = {
        Body: fs.createReadStream(filePath),
        Bucket: bucket,
        // Remove .html from html files, means we get clean URLS!
        Key:
          mime.lookup(filePath) === 'text/html'
            ? fp.replace('.html', '', fileKey)
            : fileKey,
        ContentType: mimeType || 'text/plain',
        CacheControl: 'max-age=315360000',
      };
      return sdk.s3.putObject(params).promise();
    }),
  );
};

export default async (
  directory: string,
  bucket: string,
): Promise<BucketType> => {
  const folderContents = fs.readdirSync(directory);
  const isClientSideRouted = fs.existsSync(path.resolve(directory, '200.html'));
  const buckets = await getBuckets();
  const existingBucket = fp.find({ Name: bucket }, buckets);

  if (!existingBucket) {
    await createNewBucket(bucket);
  } else {
    await clearBucket(bucket);
  }

  const region = await getBucketRegion(bucket);
  const siteBaseDir = path.resolve(process.cwd(), directory);
  await uploadDirectoryContents(bucket, siteBaseDir, folderContents);

  return {
    name: bucket,
    url: `${bucket}.s3-website-${region}.amazonaws.com`,
    isClientSideRouted,
    region,
  };
};
