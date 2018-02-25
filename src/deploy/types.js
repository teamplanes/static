// @flow

export type BucketType = {
  region: string,
  url: string,
  name: string,
  isClientSideRouted: boolean,
};

export type ArgsType = {
  directory: string,
  domain: string,
};

export type CDNType = {
  url: string,
  isNew: boolean,
  distributionId: string,
};
